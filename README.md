# NoblePhantasm
A Modern spin off of the game Mafia using the theme of ghosts but without the hassle of using playing cards!<br>

## Play it now!
http://noble-phantasm.herokuapp.com/ <br>
`Note that players do not need to create an account to play. Online play is handled by a lobby
feature which allows players to quickly create, invite and play games with friends.`

Roles include:
  - Ghost
  - Exorcist
  - Citizens
  - Priest
  - Healer
  - Clown
  - More coming soon!
  
Game Rules:
  https://en.wikipedia.org/wiki/Mafia_(party_game)


## Instructions for Heroku Deployment
1) Create heroku account and loging using `heroku login`
2) Run command `heroku app create`
3) Run command `npm run build` (Creates static html,css, js files rather then using react server)
4) `git add -A` and `git add build` folder from inside Noble Phantasm Directory
5) Add a git commit message (does not matter what it is)
6) `git push heroku` to deply app
7) App is now running your heroku address

* Note that `npm run build` creates a build folder. Make sure to add that to the commit for Heroku

