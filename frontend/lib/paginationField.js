import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField () {
    return { 
        keyArgs: false, // tells Apollo we will take care of everything
        read(existing = [], { args, cache }) {
            console.log({ existing, args, cache });
            const { skip, first } = args;

            // Read the # of items on the page from the cache
            const data = cache.readQuery({ query: PAGINATION_QUERY });
            const count = data?._allProductsMeta?.count;
            const page = skip / first + 1;
            const pages = Math.ceil(count / first);

            // check if we have existing items
            const items = existing.slice(skip, skip + first).filter((x) => x);
            // If there are items, and there aren't enough items to satisfy how many were requested
            // and we are on the last page, THEN just send it. 
            if (items.length && items.length !== first && page === pages) {
                return items;
            }
            if(items.length !== first) {
                // We dont have any items, we must go to the network to fetch them
                return false;
            }

            // If there are items, just return them from the cache, and non need to fo to the network
            if(items.length) {
                console.log(
                    `There are ${items.length} items in the cache! Gonna send them to Apollo`
                );
                return items;
            }

            return false; // fallback to network

            // First thing it does is ask the read function for those items

            // We can do 2 things here:

            // 1. Return the tems because they are already in the cache

            // 2. return falde from here (network request)

        },
        merge (existing, incoming, { args }) {
            const { skip, first } = args;
            // This runs when the Apollo client come back from the netwkr with  our product
            console.log(`Merging items from the network ${incoming.length}`);
            const merged = existing ? existing.slice(0): [];
            for(let i = skip; i < skip + incoming.length; ++i) {
                merged[i] = incoming[i - skip];
            }
            console.log(merged);
            // finally we return the merged items from the cache,
            return merged;
        },
    };
}