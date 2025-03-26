import { useState } from "react";

function LogInPage() {
    const [data, setData] = useState({
        username: "",
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
        console.log("Final User Log In Data:", data);
    }

    return (
        <div>
            <h1>Log In Page</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username"> Username: </label>
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    value={data.username} 
                    onChange={handleChange} 
                />
                <br />
                
                <label htmlFor="password"> Password: </label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={data.password} 
                    onChange={handleChange} 
                />
                <br />

                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default LogInPage;
