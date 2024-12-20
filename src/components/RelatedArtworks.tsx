"use client";

import { gql, useQuery } from "@apollo/client";
import Artwork from "./Artwork";
import FetchHandler from "./LoadingAndErrorContainer";
import { Category, QueryResult } from "@/types";

const FETCH_QUERY = gql`
    query ($where: ArtworkWhereInput) {
        artworks(where: $where, take: 6) {
            id
            title
            categories {
                id
                name
            }
            images {
                id
                image {
                    publicUrl
                }
            }
        }
    }
`;


export default function RelatedArtworks({ id, categories }: { id: string | string[] | undefined; categories: Category[] }) {
    const { loading, error, data } = useQuery<QueryResult>(FETCH_QUERY, {
        variables: {
            where: {
                id: {
                    not: {
                        equals: id
                    }
                },
                categories: {
                    some: {
                        id: {
                            in: categories.map(({ id }) => id)
                        }
                    }
                }
            }
        }
    });

    return (
        <FetchHandler loading={loading} error={error}>
            <section className="mx-2 lg:mx-4 m-6 mb-8 rounded-xl lg:rounded-[30px] px-2 pt-4 md:pt-8 md:p-6 pb-4 flex flex-col gap-6 md:gap-8 bg-gray-300">
                <h2 className="tracking-tight text-2xl lg:text-4xl">Other Artworks</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {
                        data?.artworks?.slice(0, 6)?.map((artwork) => (
                            <Artwork key={artwork.id} {...artwork} isRelated />
                        ))
                    }
                </ul>
            </section>
        </FetchHandler>
    )
}