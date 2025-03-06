# blueberry

Project Blueberry is a tool that helps you build full-stack apps with AI. It helps you plan, build, test and deploy your app. Product Building has never been so easy!


## Install
```
pip install git+https://github.com/lumiralabs/blueberry
```

## Usage

### Create a new project
```
blueberry init <name> <description>
```

creates a folder structure with:
```
<name>
├── frontend/
│   ├── pages/...
│   ├── api/...
│   └── package.json
└── supabase/
    └── migration files
```

Examples:
```
blueberry init todo_list_app "A todo list app"
```


```
# ....
# [clarify] asking user for more details
# ....
# [testing] running frontend tests
# ....
# [testing] running backend tests
# ....
# [testing] tests failed!! endpoint timeout
# ....
# [repair agent] looking at the logs and fixing the code
# ....
# [testing] running backend tests
# ....
# [testing] tests passed
# ....
# [verified]
# ....
# [operator / web-ui] using a web-ui agent to generate the google auth keys to set up the supabase auth
# ....
# [verified]
# ....
[deployed] here's the render deployment: https://todo-list-app.onrender.com
[deployed] here's your deployment: https://todo-list-app.vercel.app
```


### Modify an existing project

```
blueberry modify <name> <change_description>
```

```
blueberry modify todo_list_app "Add a new feature to the app"
```


Ambitious Examples:

- a restaurant manangement and performance monitoring app, with a dashboard on the performance metrics, restaurant and a dashboard on the restaurant manager