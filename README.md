🚀 DevPulse – Internal Tech Issue & Feature Tracker
A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

Live URL: https://devpulseassignment2.onrender.com Repository: https://github.com/Masuddu216/devpulseassignment2/tree/main

✨ Features
🔐 JWT Authentication – secure login with role‑based access control.
👥 Two user roles – contributor (report issues, edit own open issues) and maintainer (full CRUD + workflow control).
🐞 Issue management – create, view, update, delete bug reports & feature requests.
🔍 Filter & sort – issues can be filtered by type (bug/feature_request) and status, sorted by newest/oldest.
📦 No SQL JOINs – reporter details are fetched in separate batched queries (fully compliant with assignment spec).
🛡️ Secure – passwords hashed with bcrypt (10 rounds), JWT signed with secret, environment variables validated at startup.
📁 Modular architecture – clean separation of routes, controllers, services, queries, validation, and utilities.
🧰 Tech Stack
Technology	Purpose
Node.js (24.x)	JavaScript runtime
TypeScript (ESNext)	Type safety and modern JS
Express.js	Web framework
PostgreSQL	Relational database
pg (raw driver)	Database access – no ORM, no query builder, no JOINs
bcrypt	Password hashing
jsonwebtoken	JWT creation & verification
dotenv	Environment configuration
cors	Cross‑origin resource sharing
tsx / ts-node-dev	Development runner (ES modules)
📦 Installation & Setup
1. Clone the repository
git clone https://github.com/Masuddu216/devpulseassignment2.git
cd devpulse

## ⚠️ Important Note for Evaluator

This project is deployed on Render Free Plan.
The server may take **30-50 seconds** to respond 
on the first request due to cold start.

Please wait and retry if the first request times out.


