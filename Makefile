# https://docs.docker.com/compose/reference/envvars/#compose_project_name
COMPOSE_PROJECT_NAME:="$(shell cat docker/name.conf)"

export COMPOSE_PROJECT_NAME

u: # update npm and git (generates new tag)
	@/bin/bash update.sh

uf: # update even if there is nothing new committed
	@/bin/bash update.sh force

h: # show any help that is available
	@/bin/bash test.sh --help
	@echo https://github.com/tomekwlod/knex-prototype

t: # just run tests once
	@/bin/bash test.sh

tw: # run tests in watch mode
	@/bin/bash test.sh --watch

twa: # run tests in watchAll mode
	@/bin/bash test.sh --watchAll

c: # run local server to browse coverage
	@node server.js --log 15 --port 8081 --dir coverage

cc: # run local server to general testing
	@nodemon -e js,html server.js --log 15

nt: # test .npmignore
	@npm pack

ct: # travis parameters.json
	@/bin/bash update.sh --dev

cp: # jest parameters.json
	@/bin/bash update.sh --prod

doc: docs
	(cd docker && docker-compose build)
	(cd docker && docker-compose up -d --build)

docs:
	cd docker && docker-compose stop

islinked:
	@cd dev && /bin/bash islinked.sh

link:
	npm link
	npm link knex-prototype

unlink:
	@cd dev && /bin/bash unlink.sh

manual:
	nodemon -e js,html manual.js




fixtures:
	(cd migrations && node recreate-db.js safe)
	(cd migrations && make mrun)

diff:
	(cd migrations && make diff)

mrun:
	(cd migrations && make mrun)

torun:
	(cd migrations && make torun)

mrevert:
	(cd migrations && make mrevert)

mtest:
	(cd migrations && make mtest)

