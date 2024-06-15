include .env
export

all:

send-get:
	http GET http://$(HOST)/notify/wheel/good $(KEY)

send-post:
	test -n "$(TEXT)" || (echo "TEXT is not set" && exit 1)
	http POST http://$(HOST)/notify/wheel \
	$(KEY) \
	text="$(TEXT)" \
	format="$(FORMAT)"

send-text:
	make send-post TEXT="$(TEXT)"

send-html:
	make send-post TEXT="$(TEXT)" FORMAT=HTML

send-markdown:
	make send-post TEXT="$(TEXT)" FORMAT=MarkdownV2
