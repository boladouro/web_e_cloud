import React, {useState} from "react";
import {toast} from "sonner";

export default function AuthPage() {
  const [token, setToken] = useState<string>("");
  const [signupInfo, setSignupInfo] = useState<{username: string, password: string}>({username: "", password: ""})
  const [loginInfo, setLoginInfo] = useState<{username: string, password: string}>({username: "", password: ""})
  const [confirmUser, setConfirmUser] = useState<string>("")
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const element = e.target as HTMLInputElement;
      let response: Response;
      let responsejson: any;
      switch (element.id) {
        case "token":
          toast.success("Token set")
          break
        case "login-username":
        case "login-password":
           response = await fetch(`http://127.0.0.1:5000/api/v1/user/login?username=${loginInfo.username}&password=${loginInfo.password}`, {method: "POST"})
          responsejson = await response.json()
          if (response.ok) {
            setToken(responsejson.token)
            toast.success("Logged in")
          } else {
            toast.error(responsejson.error)
          }
          break
        case "signup-username":
        case "signup-password":
          response = await fetch(`http://127.0.0.1:5000/api/v1/user/signup?username=${signupInfo.username}&password=${signupInfo.password}&token=${token}`, {method: "POST"})
          responsejson = await response.json()
          if (response.ok) {
            toast.success("Account created")
          } else {
            toast.error(responsejson.error)
          }
          break
        case "confirm":
          response = await fetch(`http://127.0.0.1:5000/api/v1/user/confirmation?username=${confirmUser}&token=${token}`, {method: "POST"})
          responsejson = await response.json()
          if (response.ok) {
            toast.success("Account confirmed")
          } else {
            toast.error(responsejson.error)
          }
          break
      }
    }
  }

  return <>
    <div className="field is-horizontal">
      <div className={"field-label is-normal"}>
        <label className={"label"} htmlFor="token">Token</label>
      </div>
      <div className={"field-body"}>
        <div className={"field"}>
          <div className={"control"}>
            <input className={"input"} type="text" id="token" value={token} onKeyDown={handleKeyDown} placeholder={"Token"}
                   onChange={(e) => setToken(e.target.value)}/>
          </div>
        </div>
      </div>
    </div>
    <hr/>
    <div className="field is-horizontal">
      <div className={"field-label is-normal"}>
        <label className={"label"} htmlFor="login-username">Login</label>
      </div>
      <div className={"field-body"}>
        <div className={"field"}>
          <div className={"control"}>
            <input className={"input"} type="text" id="login-username" value={loginInfo.username} placeholder={"Username"} onKeyDown={handleKeyDown}
                   onChange={(e) => setLoginInfo({...loginInfo, username: e.target.value})}/>
          </div>
        </div>
        <div className={"field"}>
          <div className={"control"}>
            <input className={"input"} type="password" id="login-password" value={loginInfo.password} placeholder={"Password"} onKeyDown={handleKeyDown}
                   onChange={(e) => setLoginInfo({...loginInfo, password: e.target.value})}/>
          </div>
        </div>
      </div>
    </div>
    <hr/>

    <div className="field is-horizontal">
      <div className={"field-label is-normal"}>
        <label className={"label"} htmlFor="signup-username">Create Account</label>
      </div>
      <div className={"field-body"}>
        <div className={"field"}>
          <div className={"control"}>
            <input className={"input"} type="text" id="signup-username" value={signupInfo.username} placeholder={"Username"} onKeyDown={handleKeyDown}
                   onChange={(e) => setSignupInfo({...signupInfo, username: e.target.value})}/>
          </div>
        </div>
        <div className={"field"}>
          <div className={"control"}>
            <input className={"input"} type="password" id="signup-password" value={signupInfo.password} placeholder={"Password"}
                    onKeyDown={handleKeyDown}
                   onChange={(e) => setSignupInfo({...signupInfo, password: e.target.value})}/>
          </div>
        </div>
      </div>
    </div>
    {token &&
      <div className="field is-horizontal">
        <div className={"field-label is-normal"}>
          <label className={"label"} htmlFor="confirm">Confirm Account</label>
        </div>
        <div className={"field-body"}>
          <div className={"field"}>
            <div className={"control"}>
              <input className={"input"} type="text" id="confirm" value={confirmUser} onKeyDown={handleKeyDown}
                     placeholder={"Account username"}
                     onChange={(e) => setConfirmUser(e.target.value)}/>
            </div>
          </div>
        </div>
      </div>

    }
  </>
}