<div align="center">
    <img width="150" alt="icon" src="https://github.com/user-attachments/assets/fcb52502-d7b1-47bf-a8be-09e8a60f539d" />
    <h1>Rocket.Poker</h1>
</div>

Rocket.Poker helps your team estimate story points using a collaborative voting system directly in Rocket.Chat.

## Features

- 🎯 **Session-based Planning**: Create dedicated discussions for planning sessions
- 🗳️ **Interactive Voting**: Team members vote using customizable point scales
- 👁️ **Closed Voting Mode**: Results hidden until finished - ensures unbiased estimates
- 👁️ **Open Voting Mode**: Real-time results visible to all participants
- 📊 **Visual Graphs**: Bar charts show vote distribution
- 👥 **Voter Tracking**: See who has voted without revealing their choices (in closed mode)
- ⚙️ **Flexible Options**: Configurable voting scale via settings

## Commands

### `/poker-session [title]`
Creates a new poker planning session as a discussion.
- **title** (optional): Session name - if not provided, uses current date
- Example: `/poker-session Poker Session - February 19, 2026`

### `/poker-story [title]`
Creates a new story for voting (must be used inside a poker session discussion by the session owner).
- **title** (optional): Story name
- Example: `/poker-story Update README.md`

Opens a modal where you can enter:
- **Title** (required): Story name
- **ID** (optional): Story identifier (e.g., JIRA-123)
- **Link** (optional): URL to story details
- **Description** (optional): Additional context
- **Visibility**: Choose between closed (results shown after finish) or open (real-time results)

### `/poker-help`
Displays quick reference help information.

## Quick Start

1. Run `/poker-session` in any channel to create a planning session
2. Join the discussion that opens
3. As the session owner, use `/poker-story` to add stories for estimation
4. Team members vote by clicking the voting buttons
5. The owner clicks "Finish Voting" to reveal final results
6. The owner can click "Reopen Voting" to allow more votes if needed

## Contributing

You'll need to set up the Rocket.Chat Apps dev environment, please see https://developer.rocket.chat/apps-engine/getting-started

To install it using the command line, you have to turn on the setting `Enable development mode` on the Rocket.Chat server under `Admin > General > Apps`.

Change the values from [.rcappsconfig](.rcappsconfig) to reflect your dev environment.

Then you can clone this repo and then:

```bash
npm install
rc-apps deploy
```

Follow the instructions and when you're done, the app will be installed on your Rocket.Chat server.

## 💝 Support This Project

Rocket.Poker is free and open-source. If it helps your team, consider supporting development:

- ☕ [Buy me a coffee](https://www.paypal.com/donate/?business=LYLM7HAUC8QAQ&no_recurring=0&item_name=If+you+find+Rocket.Poker+useful%2C+consider+buying+me+a+coffee%21&currency_code=USD)
- ⭐ Star this repository
- 🐛 Report bugs or suggest features

Every contribution helps keep this project alive!
