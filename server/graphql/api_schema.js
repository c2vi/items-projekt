const { buildSchema } = require("graphql")

main_schema = {
    schema: buildSchema(`
        type RootQuerry {
            plain_texts: [String!]!

        }

        type RootMutation {
            createEvent(name:String):String

        }

        schema {
            query: RootQuerry
            mutation: RootMutation
        }
    `),
    rootValue: {
        plain_texts: () => {
            return [ "event1", "event2", "event3" ];
        },
        createEvent: (args) => {
            return args.name;
        }

    }
};


module.exports = main_schema;

