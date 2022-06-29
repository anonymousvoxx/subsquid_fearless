process: migrate
	@node -r dotenv/config lib/processor.js


serve:
	@npx squid-graphql-server


migrate:
	@npx squid-typeorm-migration apply


migration:
	@npx squid-typeorm-migration generate


build:
	@npm run build


codegen:
	@npx sqd codegen


typegen:
	@make explore
	@npx squid-substrate-typegen ./typegen/typegen.json


explore:
	@npx squid-substrate-metadata-explorer \
 		--chain wss://wss.moonbeam.network \
 		--archive https://moonbeam.archive.subsquid.io/graphql \
 		--out ./typegen/versions.jsonl


up:
	@docker-compose up -d


down:
	@docker-compose down


.PHONY: process serve start codegen migration migrate up down typegen
