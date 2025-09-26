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
