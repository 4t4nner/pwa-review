
ROOT=$(CURDIR)/..

PUBLIC_PATH=$(ROOT)/public
BUILD_PATH=$(CURDIR)/build
BUILD_LINK_PATH=$(ROOT)/public/pwa

cBuild:
	rm -rf $(BUILD_PATH)/* && npm run build
cDev:
	rm -rf $(BUILD_PATH)/* && npm run build