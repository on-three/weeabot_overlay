TARGET=weeabot_overlay.nw
SOURCES:=index.html package.json
SOURCES+=$(wildcard media/*)
SOURCES+=$(wildcard js/*)
SOURCES+=$(wildcard css/*)

$(TARGET): $(SOURCES)
	zip $(TARGET) $(SOURCES)
	
clean:
	rm $(TARGET)

run:
	nw saxguy.nw --enable-transparent-visuals --disable-gpu