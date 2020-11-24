# Subscription

```ts
// Step 1. Import
import Event from "https://deno.land/x/subscription";

// Step 2. Create a new event.
const myEvent = new Event();

// Step 3. Subscribe to the event.
myEvent.subscribe(() => console.log("Hello"));

// Step 4. Dispatch the event.
await myEvent.dispatch();
```

`for await` style:

```ts
for await (const [] of myEvent)
{
	console.log("Hello");
}
```

## Usecase example:

```ts
const greeter = new Event<[ name: string ]>();

myEvent.subscribe(name => console.log("Hello %s!", name));

myEvent.dispatch("Sam");
myEvent.dispatch("John");
myEvent.dispatch("Sarah");
myEvent.dispatch("Zoe");

// Hello Sam!
// Hello John!
// Hello Sarah!
// Hello Zoe!
```
