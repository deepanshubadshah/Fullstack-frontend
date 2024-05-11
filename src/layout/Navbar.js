import React from 'react'

export default function Navbar() {
  return (
    <div>
        <nav class="navbar navbar-expand-lg px-5 pd-vert nav-cont">
            <a class="navbar-brand nav-opt px-2" href="/">Home</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item active px-3">
                        <a class="nav-link nav-opt" href="/">Nonprofits</a>
                    </li>
                    <li class="nav-item px-3">
                        <a class="nav-link nav-opt" href="/foundations">Foundations</a>
                    </li>
                    <li class="nav-item px-3">
                        <a class="nav-link nav-opt" href="/email-templates">Templates</a>
                    </li>
                    <li class="nav-item px-3">
                        <a class="nav-link nav-opt" href="/emails">Emails</a>
                    </li>
                </ul>
            </div>
        </nav>

    </div>
  )
}
