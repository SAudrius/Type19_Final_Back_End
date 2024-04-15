### Back end

Get started

1. Add Variables for db
2. If localhost database change to dbConfig not dbConfigremote in config.ts dir
3. Add env varibles from env.example
4. Create db from database folder to mysql and connect to db
4.1 Create categories towns first then create users and ads
4.2 insert values from values.sql
`npm run ts`<br/>

`npm run dev`




### For development

Used for eslint rule sort imports to automaticaly format code on save 

`mkdir .vscode`</br>

`cd .vscode`</br>

`touch settings.json`</br>
```
echo '{
      "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit"
    }
}' > settings.json
```