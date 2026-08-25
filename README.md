# Sportsera - Sports Tournament Management Platform

**Sportsera** is a full-stack web application that connects sports organisers and players. Organisers can publish tournaments, manage their profiles, and showcase their organisations. Players can discover tournaments by city and sport, manage their player profiles, and stay updated on upcoming events.

---

## Features

### Authentication & User Management
- **User Signup** with email validation and duplicate check
- **Role-based login** — separate dashboards for Organisers and Players
- **Password update** functionality with current password verification
- **Welcome email** sent automatically on successful signup via Gmail SMTP

### For Organisers
- **Organiser Profile** — create and update organisation details
- **Profile Picture Upload** — images stored on Cloudinary CDN
- **Tournament Publishing** — publish tournaments with poster, entry fee, prizes, date, location, and game type
- **Organiser Dashboard** — centralized hub to manage profile and tournaments

### For Players
- **Player Profile** — create and update personal profile with game preferences
- **Profile Picture Upload** — images stored on Cloudinary CDN
- **Tournament Finder** — search and filter tournaments by city and game type
- **Player Dashboard** — view profile and discover tournaments

### Tournament Discovery
- Filter tournaments by **city** and **game/sport**
- View tournament details including entry fee, prizes, date, venue, and poster
- Browse all published tournaments in a clean card-based layout

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Database | MySQL 8 (Aiven Cloud) |
| File Storage | Cloudinary |
| Email Service | Nodemailer (Gmail SMTP) |
| Frontend | HTML5, CSS3, JavaScript |
| Environment | dotenv |

---

## Project Structure

```
Sports/
├── public/                          # Static frontend files
│   ├── index.html                   # Landing page + Login/Signup
│   ├── dashOrganiser.html           # Organiser dashboard
│   ├── dashPlayer.html              # Player dashboard
│   ├── OrganiserProfile.html        # Organiser profile form
│   ├── PlayerProfile.html           # Player profile form
│   ├── publish-tournaments.html     # Tournament publishing form
│   ├── tournaments-finder.html      # Tournament search & discovery
│   └── uploads/                     # Local upload staging folder
├── server.js                        # Express server & API routes
├── mailer.js                        # Email service (Nodemailer)
├── package.json                     # Dependencies & scripts
├── .env                             # Environment variables (not in repo)
└── README.md
```

---

## Database Schema

The application uses a MySQL database hosted on **Aiven Cloud** with the following tables:

### `users`
| Column | Type | Description |
|--------|------|-------------|
| `email` | VARCHAR | Primary key, user email |
| `pwd` | VARCHAR | Password |
| `utype` | VARCHAR | User type: `Organiser` or `Player` |
| `dos` | DATE | Date of signup (auto) |
| `status` | INT | Account status |

### `organisations`
| Column | Type | Description |
|--------|------|-------------|
| `email` | VARCHAR | FK to users |
| `organisation` | VARCHAR | Organisation name |
| `contact` | VARCHAR | Contact number |
| `address` | VARCHAR | Address |
| `city` | VARCHAR | City |
| `proof` | VARCHAR | ID proof details |
| `ppic` | VARCHAR | Profile picture URL (Cloudinary) |
| `sports` | VARCHAR | Comma-separated sports |
| `hosted` | INT | Tournaments hosted count |
| `web` | VARCHAR | Website URL |

### `players`
| Column | Type | Description |
|--------|------|-------------|
| `email` | VARCHAR | FK to users |
| `name` | VARCHAR | Player name |
| `games` | VARCHAR | Preferred games |
| `mobile` | VARCHAR | Mobile number |
| `dob` | DATE | Date of birth |
| `gender` | VARCHAR | Gender |
| `address` | VARCHAR | Address |
| `city` | VARCHAR | City |
| `proof` | VARCHAR | ID proof |
| `filename` | VARCHAR | Profile picture URL (Cloudinary) |
| `otherinfo` | VARCHAR | Additional info |

### `tournaments`
| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Auto-increment PK |
| `tournaments` | VARCHAR | Tournament type |
| `emailid` | VARCHAR | Organiser email (FK) |
| `game` | VARCHAR | Sport/game name |
| `title` | VARCHAR | Tournament title |
| `fee` | VARCHAR | Entry fee |
| `dot` | DATE | Date of tournament |
| `city` | VARCHAR | City |
| `location` | VARCHAR | Venue location |
| `prizes` | VARCHAR | Prize details |
| `poster` | VARCHAR | Poster URL (Cloudinary) |
| `info` | VARCHAR | Additional info |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/SignUp` | Register new user |
| GET | `/Check-user-SignUp` | Check if email already exists |
| GET | `/login` | User login |
| GET | `/checkUser` | Verify user credentials |
| GET | `/update-Pwd` | Update password |

### Email
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/SendMail` | Send welcome email |

### Organiser Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/save` | Save organiser profile |
| POST | `/update` | Update organiser profile |
| GET | `/FetchDetails` | Fetch organiser details by email |

### Player Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/savePlayer` | Save player profile |
| POST | `/updatePlayer` | Update player profile |
| GET | `/FetchPlayerDetails` | Fetch player details by email |

### Tournaments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload-tournaments` | Publish a new tournament |
| GET | `/fetch-all-records` | Fetch tournaments by city & game |
| GET | `/fetch-cities` | Get all tournament cities |
| GET | `/fetch-games` | Get all tournament games |

### Pages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Landing page |
| GET | `/OrganiserProfile` | Organiser profile page |
| GET | `/tournaments-finder` | Tournament finder page |
| GET | `/Publish-Tournaments` | Tournament publish page |

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- MySQL database (local or cloud)
- Cloudinary account
- Gmail account (for SMTP)

### 1. Clone the Repository
```bash
git clone https://github.com/Devansh828/Sports.git
cd Sports
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
AIVEN_PASSWORD=your_aiven_mysql_password
```

### 4. Configure Database
Update the database connection in `server.js` if needed:
```javascript
let configuration = "mysql://avnadmin:" + password + "@mysql-1fb819c0-goyaldevansh828-19a6.j.aivencloud.com:28158/defaultdb?ssl-mode=REQUIRED"
```

### 5. Configure Cloudinary
Update Cloudinary credentials in `server.js`:
```javascript
cloudinary.config({
    cloud_name: 'your_cloud_name',
    api_key: 'your_api_key',
    api_secret: 'your_api_secret'
});
```

### 6. Configure Email Service
Update email credentials in `mailer.js`:
```javascript
auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
}
```
> Use a Gmail App Password, not your regular password.

### 7. Run the Server
```bash
npm start
```
The server will start on **http://localhost:2006**

---

## Usage

1. **Open** `http://localhost:2006` in your browser
2. **Sign up** as an Organiser or Player
3. **Login** with your credentials
4. **Organisers**: Complete your profile, then publish tournaments
5. **Players**: Complete your profile, then browse tournaments by city and sport

---

## Screenshots

> Add screenshots of your application here to showcase the UI.

---

## Future Improvements

- [ ] Add tournament registration for players
- [ ] Implement payment gateway for entry fees
- [ ] Add real-time notifications for tournament updates
- [ ] Build a responsive mobile UI
- [ ] Add tournament brackets and scheduling
- [ ] Implement review/rating system for organisers
- [ ] Add social sharing for tournaments
- [ ] Dockerize the application
- [ ] Add comprehensive test coverage

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Author

**Devansh** — [GitHub](https://github.com/Devansh828)

---

## Acknowledgments

- Express.js Documentation
- Cloudinary Documentation
- Aiven Cloud MySQL
- Nodemailer Documentation
