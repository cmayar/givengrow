import express from "express";
import db from "../model/helper.js";

const router = express.Router();

//helper function to get interactions based on user type (owner or borrower)
const getInteractionsByUser = async (userId, userType) => {
  const userColumn = userType === "owner" ? "owner_id" : "borrower_id";

  const result = await db(
    `SELECT 
        interactions.id AS interaction_id,
        interactions.status,
        interactions.start_date,
        interactions.end_date,
        
        items.id AS item_id,
        items.title AS item_title,
        items.image AS item_image,
        items.category AS item_category,
        items.status AS item_status,
  
        borrower.id AS borrower_id,
        borrower.username AS borrower_username,
        borrower.email AS borrower_email,
        borrower.phonenumber AS borrower_phone,
  
        owner.id AS owner_id,
        owner.username AS owner_username,
        owner.email AS owner_email,
        owner.phonenumber AS owner_phone
  
       FROM interactions
       LEFT JOIN items ON interactions.item_id = items.id
       LEFT JOIN users AS borrower ON interactions.borrower_id = borrower.id
       LEFT JOIN users AS owner ON interactions.owner_id = owner.id
       WHERE interactions.${userColumn} = ?
       ORDER BY interactions.id DESC`,
    [userId]
  );

  // Return the data assuming db() returns a result object with data property
  return result.data ? result.data : result; // If result has .data, return it, else return the result directly
};

//POST request to create a new interaction
//created a new interaction with status 'requested'
//it has to verify if the item is available
//the borrower cannot be the owner of the item

router.post("/", async (req, res) => {
  const { borrower_id, owner_id, item_id, start_date, end_date } = req.body;

  //return message missing required fields, if client does not provide all required fields
  if (!borrower_id || !owner_id || !item_id || !start_date || !end_date) {
    return res.status(400).send({ message: "Missing required information" });
  }

  try {
    //check if the item exists
    const itemCheck = await db("SELECT * FROM items WHERE id = ?", [item_id]);

    //if the item does not exist, return message that the item does not exist
    if (itemCheck.data.length === 0) {
      return res.status(404).send({ message: "Item does not exist" });
    }

    //check if the item is available
    const item = itemCheck.data[0];
    if (item.status !== "available") {
      return res.status(400).send({ message: "Item is not available" });
    }

    //check if the borrower is the owner of the item
    if (borrower_id === owner_id) {
      return res
        .status(400)
        .send({ message: "Borrower cannot be the owner of the item" });
    }

    //check if the start date is before the end date
    if (new Date(start_date) >= new Date(end_date)) {
      return res
        .status(400)
        .send({ message: "End date must be later than start date" });
    }

    //create a new interaction
    const newInteraction = await db(
      "INSERT INTO interactions (borrower_id, owner_id, item_id, status, start_date, end_date) VALUES (?, ?, ?, 'requested', ?, ?)",
      [borrower_id, owner_id, item_id, start_date, end_date]
    );

    //REVIEW -
    //or interaction: newInteraction.data for all interactions

    //return message that interraction was created and a list of all interactions
    // const interactions = await db(
    //   "SELECT * FROM interactions ORDER BY id DESC"
    // );

    //REVIEW - is this supposed to be here or in the items.js file?
    // Update the item's status to "requested" after the interaction is created
    await db("UPDATE items SET status = 'requested' WHERE id = ?", [item_id]);

    res.status(201).json({
      message: "Interaction created successfully!",
      interaction: newInteraction.data[0], // assuming latest is first
    });
  } catch (err) {
    res.status(500).send({ message: "Error creating interaction" });
  }
});

// GET request for owner interactions
router.get("/owner/:id", async (req, res) => {
  const { id: ownerId } = req.params;

  try {
    const result = await getInteractionsByUser(ownerId, "owner");

    //If no interactions are found, return message that no interactions were found
    if (result.length === 0) {
      return res.status(404).send({ message: "No interactions found" });
    }

    // Extract owner info (will be the same for all interactions)
    const ownerInfo = {
      id: result[0].owner_id,
      username: result[0].owner_username,
      email: result[0].owner_email,
      phone: result[0].owner_phone,
    };

    // Format the data without repeating owner info
    const formattedData = result.map((interaction) => ({
      interaction: {
        id: interaction.interaction_id,
        status: interaction.status,
        dates: {
          start: interaction.start_date,
          end: interaction.end_date,
        },
        item: {
          id: interaction.item_id,
          title: interaction.item_title,
          image: interaction.item_image,
          category: interaction.item_category,
          status: interaction.item_status,
        },
        borrower: {
          id: interaction.borrower_id,
          username: interaction.borrower_username,
          email: interaction.borrower_email,
          phone: interaction.borrower_phone,
        },
      },
    }));

    //Return the interactions
    res.status(200).json({
      owner: ownerInfo,
      interactions: formattedData,
    });
  } catch (err) {
    res.status(500).send({ message: "Error retrieving interactions" });
  }
});

// GET request for borrower interactions
router.get("/borrower/:id", async (req, res) => {
  const { id: borrowerId } = req.params;
  try {
    const result = await getInteractionsByUser(borrowerId, "borrower");

    //If no interactions are found, return message that no interactions were found
    if (result.length === 0) {
      return res.status(404).send({ message: "No interactions found" });
    }

    // Extract borrower info (will be the same for all interactions)
    const borrowerInfo = {
      id: result[0].borrower_id,
      username: result[0].borrower_username,
      email: result[0].borrower_email,
      phone: result[0].borrower_phone,
    };

    // Format the data without repeating borrower info
    const formattedData = result.map((interaction) => ({
      interaction: {
        id: interaction.interaction_id,
        status: interaction.status,
        dates: {
          start: interaction.start_date,
          end: interaction.end_date,
        },
        item: {
          id: interaction.item_id,
          title: interaction.item_title,
          image: interaction.item_image,
          category: interaction.item_category,
          status: interaction.item_status,
        },
        owner: {
          id: interaction.owner_id,
          username: interaction.owner_username,
          email: interaction.owner_email,
          phone: interaction.owner_phone,
        },
      },
    }));

    //Return the interactions
    res.status(200).json({
      borrower: borrowerInfo,
      interactions: formattedData,
    });
  } catch (err) {
    res.status(500).send({ message: "Error retrieving interactions" });
  }
});

//PUT request for Owner to confirm change status from Requested to Borrowed

router.put("/:id/owner-confirm", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the interaction based on the id and check if it exists
    const interaction = await db("SELECT * FROM interactions WHERE id = ?", [
      id,
    ]);
    if (interaction.data.length === 0) {
      return res.status(404).send({ message: "Interaction not found" });
    }

    // Only allow the owner to confirm the interaction
    if (req.body.userType !== "owner") {
      return res
        .status(403)
        .send({ message: "Only the owner can confirm the interaction" });
    }

    // Check if the interaction status is "requested"
    if (interaction.data[0].status !== "requested") {
      return res
        .status(400)
        .send({ message: "Interaction status is not 'requested'" });
    }

    // Update the interaction status to "borrowed"
    await db("UPDATE interactions SET status = 'borrowed' WHERE id = ?", [id]);

    res
      .status(200)
      .send({
        message: "Interaction status successfully updated to 'borrowed'",
      });
  } catch (err) {
    res.status(500).send({ message: "Error updating interaction" });
  }
});

export default router;
