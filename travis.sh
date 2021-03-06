
exec 3<> /dev/null
function red {
    printf "\e[91m$1\e[0m\n"
}
function green {
    printf "\e[32m$1\e[0m\n"
}
set -e
set -x

npm link

make ct

yarn

npm link knex-prototype

cp .env.travis .env

cp migrations/ormconfig.js.mysql migrations/ormconfig.js

make fixtures

cp migrations/ormconfig.js.pg migrations/ormconfig.js

psql -c 'create database knex;' -U postgres

make mrun

EXECUTE="/bin/bash test.sh"

{ green "\n\n    executing tests:\n        $EXECUTE\n\n"; } 2>&3

$EXECUTE

knex-prototype

cp .env.travis knex-project/.env

cd knex-project

OUT="$(node test.js)"

STATUS="$?";

if [[ "$OUT" = *"count: 5"* ]] && [[ "$OUT" = *"\"Database\": \"knex\""* ]]; then

    echo 'output is good'
else

    echo 'output is NOT good'

    echo "stdout: >>$OUT<<"

    exit 1
fi

cd ..

# cat ./coverage/lcov.info | node node_modules/coveralls/bin/coveralls.js -v | grep -v "@"
node node_modules/.bin/codecov


