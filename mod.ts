/**
 * A listener (callback) type.
 */
export type Subscription<T extends unknown[] = []> = (...args: T) => unknown | Promise<unknown>;

/** A subscribable event. */
export class Event<T extends unknown[] = []> {
	/** The listeners that are currently subscribed to the event. */
	private readonly _subscriptions = new Map<Subscription<T>, boolean>();

	/**
	 * Subscribe to the event.
	 * @param listeners The subscriptions to add.
	 */
	public subscribe(...listeners: Subscription<T>[]): this {
		for (const listener of listeners)
			this._subscriptions.set(listener, false);
		return this;
	}

	/**
	 * Subscribe to the event once.
	 * @param listeners The subscriptions to add.
	 */
	public subscribeOnce(...listeners: Subscription<T>[]): this {
		for (const listener of listeners)
			this._subscriptions.set(listener, true);
		return this;
	}

	/**
	 * Unsubscribe to the event.
	 * @param listeners The subscriptions to remove.
	 */
	public unsubscribe(...listeners: Subscription<T>[]): this {
		for (const listener of listeners)
			this._subscriptions.delete(listener);
		return this;
	}

	/**
	 * Fire the event and call all subscriptions.
	 * @param args The arguments to pass along.
	 */
	public async dispatch(...args: T) {
		for (const [listener, once] of this._subscriptions) {
			try {
				await listener(...args);
				if (once) this._subscriptions.delete(listener);
			} catch (error) {
				console.error(error);
			}
		}
	}

	/**
	 * Pull the next dispatch from the event return the dispatched data.
	 */
	public pull(): Promise<T> {
		return new Promise(resolve => this.subscribeOnce((...args) => resolve(args)));
	}

	/**
	 * Async iterator.
	 */
	[Symbol.asyncIterator]() {
		return {
			next: async () => await this.pull()
		};
	}
}

export default Event;
