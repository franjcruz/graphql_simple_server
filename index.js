'use strict';

const { ServiceBroker } = require('moleculer');
const { MoleculerClientError } = require('moleculer').Errors;
const { gql } = require('graphql-request');

const ApiGateway = require('moleculer-web');
const { ApolloService } = require('./apolloService');

const broker = new ServiceBroker({ logLevel: 'info', hotReload: true });

broker.createService({
  name: 'api',

  mixins: [
    // Gateway
    ApiGateway,

    // GraphQL Apollo Server
    ApolloService({
      // API Gateway route options
      routeOptions: {
        path: '/graphql',
        cors: true,
        mappingPolicy: 'restrict',
      },

      // https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html
      serverOptions: {},
    }),
  ],

  events: {
    'graphql.schema.updated'({ schema }) {
      this.logger.info('Generated GraphQL schema:\n\n' + schema);
    },
  },
});

broker.createService({
  name: 'greeter',

  actions: {
    hello: {
      graphql: {
        query: 'hello: String!',
      },
      handler() {
        return 'Hello Moleculer!';
      },
    },
    welcome: {
      graphql: {
        mutation: `
					welcome(
						name: String!
					): String!
				`,
      },
      handler(ctx) {
        return `Hello ${ctx.params.name}`;
      },
    },
    dataOEE: {
      graphql: {
        type: gql`
          type GaugeProps {
            value: Int
            min: Int
            max: Int
          }

          type LineChartProps {
            data: [LineChartData]
          }

          type LineChartData {
            id: String
            data: [LineChartPoint]
          }

          type LineChartPoint {
            x: String
            y: Int
          }

          type OEEData {
            GeneralGaugeProps: GaugeProps!
            PerformanceGaugeProps: GaugeProps!
            AvailabilityGaugeProps: GaugeProps!
            QualityGaugeProps: GaugeProps!
            LineChartProps: LineChartProps!
          }
        `,
        subscription: 'dataOEE: OEEData',
        tags: ['TEST'],
      },
      handler(ctx) {
        const mock = {
          GeneralGaugeProps: {
            value: randomIntFromInterval(0, 100),
            min: 0,
            max: 100,
          },
          PerformanceGaugeProps: {
            value: randomIntFromInterval(0, 100),
            min: 0,
            max: 100,
          },
          AvailabilityGaugeProps: {
            value: randomIntFromInterval(0, 100),
            min: 0,
            max: 100,
          },
          QualityGaugeProps: {
            value: randomIntFromInterval(0, 100),
            min: 0,
            max: 100,
          },
          LineChartProps: {
            data: [
              {
                id: '06.00',
                data: [
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                ],
              },
              {
                id: '08.00',
                data: [
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                ],
              },
              {
                id: '10.00',
                data: [
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                ],
              },
              {
                id: '12.00',
                data: [
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                ],
              },
              {
                id: '14.00',
                data: [
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                ],
              },
              {
                id: '16.00',
                data: [
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                ],
              },
              {
                id: '18.00',
                data: [
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                ],
              },
              {
                id: '20.00',
                data: [
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                  {
                    x: randomIntFromInterval(0, 16) + '',
                    y: randomIntFromInterval(1, 120),
                  },
                ],
              },
            ],
          },
          // setError: false,
          // setErrorMessage: false,
        };

        return mock;
      },
    },

    update: {
      graphql: {
        subscription: 'update: String!',
        tags: ['TEST'],
      },
      handler(ctx) {
        return ctx.params.payload;
      },
    },

    danger: {
      graphql: {
        query: 'danger: String!',
      },
      async handler() {
        throw new MoleculerClientError(
          "I've said it's a danger action!",
          422,
          'DANGER'
        );
      },
    },
  },
});

broker.start().then(async () => {
  broker.repl();

  const res = await broker.call('api.graphql', {
    query: 'query { hello }',
  });

  let counter = 1;
  setInterval(
    async () =>
      broker.broadcast('graphql.publish', {
        tag: 'TEST',
        payload: `test ${counter++}`,
      }),
    5000
  );

  if (res.errors && res.errors.length > 0)
    return res.errors.forEach(broker.logger.error);

  broker.logger.info(res.data);

  broker.logger.info(
    '----------------------------------------------------------'
  );
  broker.logger.info(
    'Open the http://localhost:3000/graphql URL in your browser'
  );
  broker.logger.info(
    '----------------------------------------------------------'
  );
});

const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};
