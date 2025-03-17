"use client";

import { useState } from "react";
import useUserApi from "@/api/UserApi";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register } = useUserApi();

    const Register = async (e) => {
      e.preventDefault();
      try {
        const data = await register(name, email, password);
        console.log("Registration successfull", data);
      } catch (error) {
        console.error("Registration failed", error);
      }
    };

  return (
    <div className="main-div">
        <form onSubmit={Register}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
        </form>
    </div>
  );
}
