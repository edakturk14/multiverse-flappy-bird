-include .env

.PHONY: all test clean deploy fund help install snapshot format anvil scopefile

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
ANVIL_URL := http://127.0.0.1:8545

all: remove install build

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules" && rm -rf node_modules

install :; forge install foundry-rs/forge-std --no-commit && forge install openzeppelin/openzeppelin-contracts --no-commit && forge install smartcontractkit/chainlink-local  --no-commit && forge install smartcontractkit/ccip@ff2bfce  --no-commit && npm i

build:; forge build

test :; forge test --via-ir

snapshot :; forge snapshot

format :; forge fmt

anvil :; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1


#  make print-heading HEADING="PUBLIC FUNCTIONS"
print-heading:
	@heading="$(HEADING)"; \
	printf "/*//////////////////////////////////////////////////////////////\n"; \
	printf "                       %s\n" "$$heading"; \
	printf "//////////////////////////////////////////////////////////////*/\n"

deploy-floppy:;	forge script script/DeployCrossChain.s.sol:DeployCrossChain -vvvv --via-ir --broadcast

end-game:;	forge script script/SendMessage.s.sol:SendMessage -vvvv --via-ir --broadcast

#   Contract deployed on arbitrumSepolia at: 0xB1C533983f2a39694E7F7fF8BD3161866BDca1D8
#   Contract deployed on baseSepolia at: 0x3c652E75FCEb8165228D4A3984BCF17E53805BD3