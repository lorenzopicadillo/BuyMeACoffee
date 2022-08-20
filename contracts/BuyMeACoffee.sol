//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Deployed to Goerli at 0x27d1eed3FF0A8092a5107d3318055F94d05284aa
// Deployed to Goerli at 0x2755b783Bc44363766808C9aC2cF555068758A30

contract BuyMeACoffee {
    // Event to create when Memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos received
    Memo[] memos;

    // Address of contract deployer
    address payable owner;

    //Deploy logic
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffee buyer
     * @param _message from the coffee buyer
     */
     function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "coffee is more than 0");

        // Add the memo to storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        //Emit a log event when new memo is created
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
     }
    
     /**
* @dev allow change the address for withdraw
     */
    function withdrawTips(address payable _receiver) public {
        require(msg.sender == owner, "Only owner can tranfer tips");
        require(_receiver.send(address(this).balance));
    }

     /**
      * @dev retrieve all the memos received and stored on the blockchain
      */
    function getMemos() public view returns(Memo[] memory) {
        return memos;

    }
    
}
