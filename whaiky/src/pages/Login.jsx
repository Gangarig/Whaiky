import React from 'react'

export const Login = () => {
  return (
    <div className='loginContainer'>
        <div className='loginWrapper'>
            <form className='loginForm'>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" value=""/>
                <label htmlFor="password">Password</label>
                <input type="password" />
            </form>
        </div>
    </div>
  )
}
