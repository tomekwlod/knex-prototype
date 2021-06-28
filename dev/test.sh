
# echo 'stop...'
# exit;

sudo chmod -R a+w .

printf "Are you sure (y): "
read q
if [ "$q" != "y" ]; then
    printf "\n... ok then stop.\n"
    exit;
fi

set -e
set -x

sudo id


if [[ "$(ls -la knex-prototype/node_modules/ | grep knex-prototype)" = *"->"* ]]; then

    echo "knex-prototype is linked"

else

    #(cd github && yarn)

    (cd github && npm link)
fi

sudo rm -rf node_modules

mv knex-prototype/node_modules . || true

    #sudo rm -rf node_modules_puppeteer

    #mv knex-prototype/puppeteer/node_modules node_modules_puppeteer || true

sudo rm -rf knex-prototype

# knex-prototype
mkdir knex-prototype
cp -R github/example/* ./knex-prototype/

#mv node_modules knex-prototype/node_modules || true

    #mv node_modules_puppeteer knex-prototype/puppeteer/node_modules || true

#if [ ! -e knex-prototype/node_modules/knex-prototype ]; then

    (cd knex-prototype && yarn)
#fi

    #if [ ! -e knex-prototype/puppeteer/node_modules/puppeteer ]; then

    #    (cd knex-prototype/puppeteer && yarn)
    #fi

(cd knex-prototype && npm link knex-prototype)

echo 'Should be symlink not real directory:';
(cd knex-prototype && ls -la node_modules | grep knex-prototype)

#(cd knex-prototype && sudo yarn dev)
