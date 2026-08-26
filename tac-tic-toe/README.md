# tac-tic-toe

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Deployment

The Vue app is deployed to GitHub Pages by `.github/workflows/deploy-pages.yml`,
and the Socket.IO server is deployed to Azure App Service by
`.github/workflows/deploy-server.yml`.
Set the repository variable `VUE_APP_SOCKET_URL` to the public HTTPS URL of the
Socket.IO server before deploying, for example:

```
https://tactic-toe-server.azurewebsites.net
```

The workflow assumes the repository is named `Tactic-Toe` and publishes at
`https://<owner>.github.io/Tactic-Toe/`. Update `VUE_APP_PUBLIC_PATH` in the
workflow if using a custom domain or a different repository name.

The Azure workflow requires repository secrets named
`AZURE_WEBAPP_NAME` and `AZURE_WEBAPP_PUBLISH_PROFILE`.
