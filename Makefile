include .env
export

all:

send-get:
	http GET $(HOST)/notify/wheel/good $(ME)

send-post:
	test -n "$(TEXT)" || (echo "TEXT is not set" && exit 1)
	http POST $(HOST)/notify/wheel \
	$(ME) \
	text="$(TEXT)" \
	format="$(FORMAT)"

send-text:
	make send-post TEXT="$(TEXT)"

send-html:
	make send-post TEXT="$(TEXT)" FORMAT=HTML

send-markdown:
	make send-post TEXT="$(TEXT)" FORMAT=MarkdownV2
