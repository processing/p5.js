import '../../types/global'

function setup() {
  noCanvas()

  const messages = [
    { content: 'Hello, world!' },
    { content: "How's it going?" },
  ]
  const message = random(messages)

  // The types should fail if the result of random() is any
  logMessage(message);
  
  testShuffleMaintainsType();
}

// From: https://stackoverflow.com/a/50375286/62076
type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

// If T is `any` a union of both side of the condition is returned.
type UnionForAny<T> = T extends never ? 'A' : 'B'

// Returns true if type is any, or false for any other type.
type IsStrictlyAny<T> =
  UnionToIntersection<UnionForAny<T>> extends never ? true : false

type NotAny<T> = IsStrictlyAny<T> extends true ? never : T

function logMessage(message: NotAny<{ content: string }>) {
  console.log(message)
}



/** test that shuffle(arr) preserves arr type in return, not just any[] */
function testShuffleMaintainsType(){
  
	type Expect<T extends true> = T;
	type Equal<X, Y> = 
		(<T>() => T extends X ? 1 : 2) extends 
		(<T>() => T extends Y ? 1 : 2) ? true : false;

	const shuffleResult1 = shuffle(["a", "b", "c"]);
	const shuffleResult2 = shuffle(["a", 10, null]);
  //check the signature with the optional boolean type-checks, too
	const shuffleResult3 = shuffle([10, 20, 30], true);

	type ShuffleTest1 = Expect<Equal<typeof shuffleResult1, string[]>>;
  type ShuffleTest2 = Expect<Equal<typeof shuffleResult2, (string|number|null)[]>>;
  type ShuffleTest3 = Expect<Equal<typeof shuffleResult3, number[]>>;
}
