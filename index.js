'use strict';

const { ServiceBroker } = require('moleculer');
const { MoleculerClientError } = require('moleculer').Errors;
const { gql } = require('graphql-request');

const ApiGateway = require('moleculer-web');
const { ApolloService } = require('./apolloService');

const broker = new ServiceBroker({ logLevel: 'info', hotReload: true });

const minValue = 0;
const maxValue = 100;
const minAvgValue = 60;
const maxValueVariation = 10;

const getNextValue = ( currentValue ) => {

  let nextValue = currentValue + randomIntFromInterval((-1 * maxValueVariation), maxValueVariation);

  if ( nextValue > maxValue ) {
    nextValue = maxValue;
  } else if ( nextValue < minAvgValue ) {
    nextValue = minAvgValue;
  }

  return nextValue;

};

let currentValues = {
  performance: [((maxValue + minAvgValue) / 2)],
  availability: [((maxValue + minAvgValue) / 2)],
  quality: [((maxValue + minAvgValue) / 2)],
};

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
            min: minValue,
            max: maxValue,
          },
          PerformanceGaugeProps: {
            value: currentValues.performance[currentValues.performance.length-1],
            min: minValue,
            max: maxValue,
          },
          AvailabilityGaugeProps: {
            value: currentValues.availability[currentValues.availability.length-1],
            min: minValue,
            max: maxValue,
          },
          QualityGaugeProps: {
            value: currentValues.quality[currentValues.quality.length-1],
            min: minValue,
            max: maxValue,
          },
          LineChartProps: {
            data: [
              {
                id: 'Performance',
                data: [
                  {
                    x: '06:00',
                    y: currentValues.performance[currentValues.performance.length-6] || 80,
                  },
                  {
                    x: '08:00',
                    y: currentValues.performance[currentValues.performance.length-5] || 80,
                  },
                  {
                    x: '10:00',
                    y: currentValues.performance[currentValues.performance.length-4] || 80,
                  },
                  {
                    x: '12:00',
                    y: currentValues.performance[currentValues.performance.length-3] || 80,
                  },
                  {
                    x: '14:00',
                    y: currentValues.performance[currentValues.performance.length-2] || 80,
                  },
                  {
                    x: '16:00',
                    y: currentValues.performance[currentValues.performance.length-1],
                  },
                ],
              },
              {
                id: 'Availability',
                data: [
                  {
                    x: '06:00',
                    y: currentValues.availability[currentValues.availability.length-6] || 80,
                  },
                  {
                    x: '08:00',
                    y: currentValues.availability[currentValues.availability.length-5] || 80,
                  },
                  {
                    x: '10:00',
                    y: currentValues.availability[currentValues.availability.length-4] || 80,
                  },
                  {
                    x: '12:00',
                    y: currentValues.availability[currentValues.availability.length-3] || 80,
                  },
                  {
                    x: '14:00',
                    y: currentValues.availability[currentValues.availability.length-2] || 80,
                  },
                  {
                    x: '16:00',
                    y: currentValues.availability[currentValues.availability.length-1],
                  },
                ],
              },
              {
                id: 'Quality',
                data: [
                  {
                    x: '06:00',
                    y: currentValues.quality[currentValues.quality.length-6] || 80,
                  },
                  {
                    x: '08:00',
                    y: currentValues.quality[currentValues.quality.length-5] || 80,
                  },
                  {
                    x: '10:00',
                    y: currentValues.quality[currentValues.quality.length-4] || 80,
                  },
                  {
                    x: '12:00',
                    y: currentValues.quality[currentValues.quality.length-3] || 80,
                  },
                  {
                    x: '14:00',
                    y: currentValues.quality[currentValues.quality.length-2] || 80,
                  },
                  {
                    x: '16:00',
                    y: currentValues.quality[currentValues.quality.length-1],
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
    async () => {

      currentValues.performance.push(getNextValue(currentValues.performance[currentValues.performance.length-1]));
      currentValues.availability.push(getNextValue(currentValues.availability[currentValues.availability.length-1]));
      currentValues.quality.push(getNextValue(currentValues.quality[currentValues.quality.length-1]));

      broker.broadcast('graphql.publish', {
        tag: 'TEST',
        payload: `test ${counter++}`,
      })
    },
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
