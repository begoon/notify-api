include .env
export

all:

send-get:
	test -n "$(TEXT)" || (echo "TEXT is not set" && exit 1)
	http GET $(HOST)/notify/$(RECEIVER)/$(TEXT) $(ME)

send-post:
	test -n "$(TEXT)" || (echo "TEXT is not set" && exit 1)
	http POST $(HOST)/notify/$(RECEIVER) \
	$(ME) \
	text="$(TEXT)" \
	format="$(FORMAT)"

send-text:
	make send-post TEXT="$(TEXT)"

send-html:
	make send-post TEXT="$(TEXT)" FORMAT=HTML

send-markdown:
	make send-post TEXT="$(TEXT)" FORMAT=MarkdownV2
