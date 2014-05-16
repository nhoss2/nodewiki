
REPORTER = spec

test:
	@./node_modules/.bin/mocha \
	--reporter $(REPORTER) \
	--check-leaks

.PHONY: test
