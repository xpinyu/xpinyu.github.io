.PHONY: build sync install

build:
	node scripts/build-index.mjs

sync: install
	node scripts/sync-articles.mjs
	node scripts/build-index.mjs

install:
	npm install
