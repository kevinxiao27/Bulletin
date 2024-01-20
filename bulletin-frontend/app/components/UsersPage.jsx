import React from "react"

async function UsersPage() {
  const staticData = await fetch("http://localhost:8080/user", {
    method: "Get",
  })
  const data = await staticData.json()
  return (
    <div>
      {data.users.map((user, index) => (
        <div key={index} className="border-2 border-black">
          <h1>{user.username}</h1>
          <h3>{user.email}</h3>
        </div>
      ))}
    </div>
  )
}

export default UsersPage
