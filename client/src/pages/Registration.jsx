import { useState } from "react";

function RegistrationPage() {
    const [data, setData] = useState({
        username: "",
        email: "",
        phonenumber: "",
        password: ""
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setData((prevData) => {
            const newState = { ...prevData, [name]: value };
            console.log("Updated State:", newState); 
            return newState;
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log("Final Submitted User Data:", data);
    }

    return (
        <div>
            <h1>Registration Page</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username"> Username: </label>
                <input type="text" id="username" name="username" value={data.username} onChange={handleChange} />
                <br />

                <label htmlFor="email"> Email: </label>
                <input type="text" id="email" name="email" value={data.email} onChange={handleChange} />
                <br />

                <label htmlFor="phonenumber"> Phone number: </label>
                <input type="text" id="phonenumber" name="phonenumber" value={data.phonenumber} onChange={handleChange} />
                <br />

                <label htmlFor="password"> Password: </label>
                <input type="password" id="password" name="password" value={data.password} onChange={handleChange} />
                <br />

                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default RegistrationPage;
