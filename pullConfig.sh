#!/bin/bash
function get_env()
{
    VAR=$(grep $1 .env | xargs)
    IFS="=" read -ra VAR <<< "$VAR"
    local  __resultvar=$1
    local  myresult=${VAR[1]}
    if [[ "$__resultvar" ]]; then
        eval $__resultvar="'$myresult'"
    else
        echo "$myresult"
    fi
}


get_env FAST_CONFIG_URL
get_env FAST_CONFIG_ID
get_env OFFLINE_START

rm -rf ./.fast/offline/*

if [ "$OFFLINE_START" == "true" ]; then
    # GET APP CONFIGURATION
    CONFIG_URL=$FAST_CONFIG_URL/configuration/submission/$FAST_CONFIG_ID
    curl $CONFIG_URL -o ./.fast/offline/Configuration.json

    # GET APP URL
    APP_URL=$(node -pe 'JSON.parse(process.argv[1]).data.APP_URL' "$(cat ./.fast/offline/Configuration.json)")
    # GET APP ROLES
    ROLES=$(node -pe 'JSON.stringify({...JSON.parse(process.argv[1]).roles, fastUpdated: Math.round((new Date()).getTime() / 1000)})' "$(curl -s $APP_URL/access)")
    echo "$ROLES" >> ./.fast/offline/Roles.json
    # GET APP TRANSLATIONS
    curl $APP_URL/translations/submission?limit=99999 -o ./.fast/offline/Translations.json
    # GET APP PAGES
    curl $APP_URL/fast-app-pages/submission?limit=99999 -o ./.fast/offline/Pages.json
    # GET APP FORMS
    curl $APP_URL/form?limit=99999 -o ./.fast/offline/Forms.json
    UPDATED=$(node -pe 'JSON.stringify({date: Math.round((new Date()).getTime() / 1000)})')
    echo "$UPDATED" >> ./.fast/offline/lastUpdate.json
fi
