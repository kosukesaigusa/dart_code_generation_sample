import * as admin from 'firebase-admin'
import {
    CollectionReference,
DocumentData,
DocumentReference,
DocumentSnapshot,
FieldValue,
Query,
QueryDocumentSnapshot,
QuerySnapshot,
SetOptions,
Timestamp,
WriteResult
} from 'firebase-admin/firestore'




export class ReadAppUserPost {
  constructor ({
    appUserPostId,
    path,
    content,
numbers,
updatedAt,
  }: {
    appUserPostId: string
    path: string
    content: string
numbers: number[]
updatedAt?: Date
  }) {
    this.appUserPostId = appUserPostId
    this.path = path
    this.content = content
this.numbers = numbers
this.updatedAt = updatedAt
  }

  readonly appUserPostId: string

  readonly path: string

  readonly content: string

readonly numbers: number[]

readonly updatedAt?: Date

  

  private static fromJson(json: Record<string, unknown>): ReadAppUserPost {
    return new ReadAppUserPost({
      appUserPostId: json['appUserPostId'] as string,
      path: json['path'] as string,
      content: (json['content'] as string | undefined) ?? '',
numbers: (json['numbers'] as unknown[] | undefined)?.map((e) => e as number) ?? [],
updatedAt: (json['updatedAt'] as Timestamp | undefined)?.toDate(),
    })
  }


  static fromDocumentSnapshot(
    ds: DocumentSnapshot
  ): ReadAppUserPost {
      const data = ds.data()!
      const cleanedData: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) {
          cleanedData[key] = value === null ? undefined : value
      }
      return ReadAppUserPost.fromJson({
          ...cleanedData,
          appUserPostId: ds.id,
          path: ds.ref.path
      })
  }

}

export class CreateAppUserPost {
  constructor({
    content,
numbers,
updatedAt,
  }: {
    content: string
numbers: number[] | FieldValue
updatedAt?: Date
  }) {
    this.content = content
this.numbers = numbers
this.updatedAt = updatedAt
  }


  readonly content: string

readonly numbers: number[] | FieldValue

readonly updatedAt?: Date

  

  toJson(): Record<string, unknown> {
  return {
    content: this.content,
numbers: this.numbers,
updatedAt: this.updatedAt,
  };
}

}

export class UpdateAppUserPost {
  constructor({
    content,
numbers,
updatedAt,
  }: {
    content?: string
numbers?: number[] | FieldValue
updatedAt?: Date
  }) {
    this.content = content
this.numbers = numbers
this.updatedAt = updatedAt
  }


  readonly content?: string

readonly numbers?: number[] | FieldValue

readonly updatedAt?: Date

  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
toJson(): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json: Record<string, any> = {}
  if (this.content != undefined) {
  json['content'] = this.content
}
if (this.numbers != undefined) {
  json['numbers'] = this.numbers
}
if (this.updatedAt != undefined) {
  json['updatedAt'] = this.updatedAt
}

  return json
}

}

export class DeleteAppUserPost {}

/**
 * A Cloud Firestore object which ignores `undefined` properties.
 */
const db = admin.firestore()
db.settings({ ignoreUndefinedProperties: true })

/**
 * Provides a reference to the appUserPosts collection for reading.
 */
export const readAppUserPostCollectionReference = (
  {
  appUserId
}: {
  appUserId: string
}
): CollectionReference<ReadAppUserPost>
=> { return db
.collection('appUsers').doc(appUserId).collection('appUserPosts').withConverter<ReadAppUserPost>({
  fromFirestore: (ds: DocumentSnapshot): ReadAppUserPost => {
    return ReadAppUserPost.fromDocumentSnapshot(ds)
  },
  toFirestore: () => {
      throw new Error(`toFirestore is not implemented for ReadAppUserPost`)
  }
})
}

/**
 * Provides a reference to a appUserPost document for reading.
 * @param appUserPostId - The ID of the appUserPost document to read.
 */
export const readAppUserPostDocumentReference = ({
  appUserId,
  appUserPostId,
}: {
  appUserId: string,
  appUserPostId: string
}): DocumentReference<ReadAppUserPost> =>
    readAppUserPostCollectionReference({
      appUserId
    }).doc(appUserPostId);


/**
 * Provides a reference to the appUserPosts collection for creating.
 */
export const createAppUserPostCollectionReference = (
  {
  appUserId
}: {
  appUserId: string
}
): CollectionReference<CreateAppUserPost>
=> { return db
.collection('appUsers').doc(appUserId).collection('appUserPosts').withConverter<CreateAppUserPost>({
  fromFirestore: () => {
    throw new Error(`fromFirestore is not implemented for CreateAppUserPost`)
  },
  toFirestore: (obj: CreateAppUserPost): DocumentData => {
      return obj.toJson()
  }
})
}

/**
 * Provides a reference to a appUserPost document for creating.
 * @param appUserPostId - The ID of the appUserPost document to read.
 */
export const createAppUserPostDocumentReference = ({
  appUserId,
  appUserPostId,
}: {
  appUserId: string,
  appUserPostId: string
}): DocumentReference<CreateAppUserPost> =>
    createAppUserPostCollectionReference({
      appUserId
    }).doc(appUserPostId);


/**
 * Provides a reference to the appUserPosts collection for updating.
 */
export const updateAppUserPostCollectionReference = (
  {
  appUserId
}: {
  appUserId: string
}
): CollectionReference<UpdateAppUserPost>
=> { return db
.collection('appUsers').doc(appUserId).collection('appUserPosts').withConverter<UpdateAppUserPost>({
  fromFirestore: () => {
    throw new Error(`fromFirestore is not implemented for UpdateAppUserPost`)
  },
  toFirestore: (obj: UpdateAppUserPost): DocumentData => {
      return obj.toJson()
  }
})
}

/**
 * Provides a reference to a appUserPost document for updating.
 * @param appUserPostId - The ID of the appUserPost document to read.
 */
export const updateAppUserPostDocumentReference = ({
  appUserId,
  appUserPostId,
}: {
  appUserId: string,
  appUserPostId: string
}): DocumentReference<UpdateAppUserPost> =>
    updateAppUserPostCollectionReference({
      appUserId
    }).doc(appUserPostId);


/**
 * Provides a reference to the appUserPosts collection for deleting.
 */
export const deleteAppUserPostCollectionReference = (
  {
  appUserId
}: {
  appUserId: string
}
): CollectionReference<DeleteAppUserPost>
=> { return db
.collection('appUsers').doc(appUserId).collection('appUserPosts').withConverter<DeleteAppUserPost>({
  fromFirestore: () => {
    throw new Error(`fromFirestore is not implemented for DeleteAppUserPost`)
  },
  toFirestore: (): DocumentData => {
    throw new Error(`toFirestore is not implemented for DeleteAppUserPost`)
  }
})
}

/**
 * Provides a reference to a appUserPost document for deleting.
 * @param appUserPostId - The ID of the appUserPost document to read.
 */
export const deleteAppUserPostDocumentReference = ({
  appUserId,
  appUserPostId,
}: {
  appUserId: string,
  appUserPostId: string
}): DocumentReference<DeleteAppUserPost> =>
    deleteAppUserPostCollectionReference({
      appUserId
    }).doc(appUserPostId);



/**
 * Manages queries against the appUserPosts collection.
 */
export class AppUserPostQuery {
  /**
   * Fetches appUserPost documents.
   * @param queryBuilder - Function to modify the query.
   * @param compare - Function to sort the results.
   */
  async fetchDocuments({
      appUserId,
      queryBuilder,
      compare
  }: {
      appUserId: string,
      queryBuilder?: (
          query: Query<ReadAppUserPost>
      ) => Query<ReadAppUserPost>
      compare?: (lhs: ReadAppUserPost, rhs: ReadAppUserPost) => number
  }): Promise<ReadAppUserPost[]> {
      let query: Query<ReadAppUserPost> =
          readAppUserPostCollectionReference({appUserId})
      if (queryBuilder != undefined) {
          query = queryBuilder(query)
      }
      const qs: QuerySnapshot<ReadAppUserPost> = await query.get()
      let result = qs.docs.map((qds: QueryDocumentSnapshot<ReadAppUserPost>) =>
          qds.data()
      )
      if (compare != undefined) {
          result = result.sort(compare)
      }
      return result
  }

  /**
   * Fetches a specific appUserPost document.
   * @param appUserPostId - The ID of the appUserPost document to fetch.
   */
  async fetchDocument({
    appUserId,
    appUserPostId
  }: {
    appUserId: string,
    appUserPostId: string
  }): Promise<ReadAppUserPost | undefined> {
    const ds = await readAppUserPostDocumentReference({
      appUserId,
      appUserPostId
    }).get()
    return ds.data()
  }

  /**
   * Adds a appUserPost document.
   * @param createAppUserPost - The appUserPost details to add.
   */
  async add({
    appUserId,
    createAppUserPost
  }: {
    appUserId: string,
    createAppUserPost: CreateAppUserPost
  }): Promise<DocumentReference<CreateAppUserPost>> {
    return createAppUserPostCollectionReference({appUserId}).add(createAppUserPost)
  }

  /**
   * Sets a appUserPost document.
   * @param appUserPostId - The ID of the appUserPost document to set.
   * @param createAppUserPost - The appUserPost details to set.
   * @param options - Options for the set operation.
   */
  async set({
      appUserId,
      appUserPostId,
      createAppUserPost,
      options
  }: {
      appUserId: string,
      appUserPostId: string
      createAppUserPost: CreateAppUserPost
      options?: SetOptions
  }): Promise<WriteResult> {
      if (options == undefined) {
          return createAppUserPostDocumentReference({
            appUserId,
            appUserPostId
          }).set(createAppUserPost)
      } else {
          return createAppUserPostDocumentReference({ 
            appUserId,
            appUserPostId 
            }).set(createAppUserPost, options)
      }
  }

  /**
   * Updates a specific appUserPost document.
   * @param appUserPostId - The ID of the appUserPost document to update.
   * @param updateAppUserPost - The details for updating the appUserPost.
   */
  async update({
    appUserId,
    appUserPostId,
    updateAppUserPost
  }: {
    appUserId: string,
    appUserPostId: string
    updateAppUserPost: UpdateAppUserPost
  }): Promise<WriteResult> {
      return updateAppUserPostDocumentReference({ 
        appUserId,
        appUserPostId 
      }).update(updateAppUserPost.toJson())
  }

  /**
   * Deletes a specific appUserPost document.
   * @param appUserPostId - The ID of the appUserPost document to delete.
   */
  async delete({
    appUserId,
    appUserPostId
  }: {
    appUserId: string,
    appUserPostId: string
  }): Promise<WriteResult> {
      return deleteAppUserPostDocumentReference({ 
        appUserId,
        appUserPostId 
      }).delete()
  }
}
