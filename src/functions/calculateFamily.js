function calculateFamily(members) {
    const mainMemberPrice = 200;
    const familyMemberPrice = 200;

    function objectLength( object ) {
        var length = 0;
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                ++length;
            };
        };
        return length;
    };

    const familyCount = objectLength(members) + 1;
    const familyPrice = mainMemberPrice + ((familyCount -1) * familyMemberPrice);

    return [familyCount, familyPrice]
};

export default calculateFamily;