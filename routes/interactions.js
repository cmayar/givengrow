import express from "express";
import db from "../model/helper.js";
import loginUser from "../middleware.js";

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

//NOTE - Helper function to handle common logic for all PUT requests
const confirmReturnStatusUpdate = async (
  id,
  userType,
  currentStatus,
  newStatus,
  res,
  req
) => {
  try {
    // Fetch the interaction based on the id and check if it exists
    const interactionCheck = await db(
      "SELECT * FROM interactions WHERE id = ?",
      [id]
    );
    if (interactionCheck.data.length === 0) {
      return res.status(404).send({ message: "Interaction not found" });
    }

    // Get the interaction data
    const interaction = interactionCheck.data[0];

    // Only allow the appropriate user(borrower/user) to confirm the return in this endpoint
    if (req.body.userType !== userType) {
      return res
        .status(403)
        .send({ message: `Only the ${userType} can confirm the return` });
    }

    // Check if the interaction status is metches the required status  before confirming
    if (interaction.status !== currentStatus) {
      return res
        .status(400)
        .send({ message: `Interaction status is not '${currentStatus}'` });
    }

    // Update the interaction status to the new status
    await db("UPDATE interactions SET status = ? WHERE id = ?", [
      newStatus,
      id,
    ]);

    //REVIEW - If final status is returned, update the item status to available
    if (newStatus === "returned") {
      await db("UPDATE items SET status = 'available' WHERE id = ?", [
        interaction.item_id,
      ]);
    }

    res.status(200).send({
      message: `Action confirmed by ${userType}, status updated to '${newStatus}'`,
    });

    //REVIEW - how do I make the error message dynamic ?
  } catch (err) {
    res
      .status(500)
      .send({ message: `Error confirming '${newStatus}' by ${userType}` });
  }
};

//POST request to create a new interaction
//created a new interaction with status 'requested'
//it has to verify if the item is available
//the borrower cannot be the owner of the item

// Add middleware to check if user is logged in
router.post("/", loginUser, async (req, res) => {
  //NOTE - Implementint borrower_id after JWT
  const borrower_id = req.user_id;
  const { item_id, start_date, end_date } = req.body;

  //return message missing required fields, if client does not provide all required fields
  if (!borrower_id || !item_id || !start_date || !end_date) {
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
    const owner_id = item.owner_id;

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

    //REVIEW - Update item status to 'unavailable'
    await db("UPDATE items SET status = 'unavailable' WHERE id = ?", [item_id]);

    res.status(201).json({
      message:
        "Interaction created successfully and item marked as unavailable!",
      interaction: newInteraction.data[0], // assuming latest is first
    });
  } catch (err) {
    //NOTE - debug
    console.error("Error creating interaction:", err);
    res.status(500).send({ message: "Error creating interaction" });
  }
});

// GET request for owner interactions
router.get("/owner/:id", async (req, res) => {
  // const { id: ownerId } = req.params;
  const { id } = req.params;

  //FIXME - TEMPORARY - this will come from the token
  const owner_id = 1;

  try {
    const result = await getInteractionsByUser(owner_id, "owner"); //FIXME - change ownerId to owner_id

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
  // const { id: borrowerId } = req.params;
  const { id } = req.params;

  //FIXME - TEMPORARY - this will come from the token
  const borrower_id = 2;

  try {
    const result = await getInteractionsByUser(borrower_id, "borrower"); //FIXME - change borrowerId to borrower_id, temporary

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

//REVIEW - refractored PUT endpoints from three to one endpint, intent 1
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { userType } = req.body;

  const owner_id = 1;

  // Check is userType is provided
  if (!userType) {
    return res.status(400).send({ message: "Missing required user type" });
  }

  try {
    if (userType === "owner") {
      // Owner action: change status from 'requested' to 'borrowed'
      if (req.body.status === "requested") {
        return confirmReturnStatusUpdate(
          id,
          "owner",
          "requested",
          "borrowed",
          res,
          req
        );
      } else if (req.body.status === "borrower-returned") {
        return confirmReturnStatusUpdate(
          id,
          "owner",
          "borrower-returned",
          "returned",
          res,
          req
        );
      } else {
        return res
          .status(400)
          .send({ message: "Invalid status change for owner" });
      }
    }

    if (userType === "borrower") {
      // Borrower action: change status from 'borrowed' to 'borrowed-return'
      if (req.body.status === "borrowed") {
        return confirmReturnStatusUpdate(
          id,
          "borrower",
          "borrowed",
          "borrower-returned",
          res,
          req
        );
      } else {
        return res.status(400).send({
          message: "Invalid status change for borrower",
        });
      }
    }
  } catch (err) {
    res.status(500).send({ message: "Error updating interaction status" });
  }
});

export default router;
