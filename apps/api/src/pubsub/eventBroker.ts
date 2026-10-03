import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

const publisher = new Redis(redisUrl);
const subscriber = new Redis(redisUrl);

export const eventBroker = {
  async publish(channel: string, event: unknown) {
    await publisher.publish(
      channel,
      JSON.stringify(event),
    );
  },

  async subscribe(
    channel: string,
    handler: (event: unknown) => void,
  ) {
    await subscriber.subscribe(channel);

    subscriber.on("message", (receivedChannel, message) => {
      if (receivedChannel !== channel) return;

      try {
        const event = JSON.parse(message);

        handler(event);
      } catch (error) {
        console.error(
          `Failed to parse event from ${channel}`,
          error,
        );
      }
    });
  },
};
