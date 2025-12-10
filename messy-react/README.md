# Problems

To address the issues, I will add some import statements and mockup functions to assume other functions are well-designed, then I focus on determining the issues and solutions.

```tsx
import { useMemo } from 'react';
import { BoxProps } from './components/BoxProps';
import { useWalletBalances } from './hooks/useWalletBalances';
import { usePrices } from './hooks/usePrices';
import { WalletRow } from './components/WalletRow';
```

I will generate mockup for `useWalletBalances`, `usePrices` and `WalletRow` in `components` and `hooks` directories.

1. Type annotations and naming conventions

- Interface name `Props` was too generic. Let me introduce a new name: `WalletPaceProps`. Although the interface is not exported, we still should name it clearly so that it is not reduntdant and making confusion.
- The code uses `balance.blockchain` but the `WalletBalance` interface doesn’t declare it. Type mismatch / TS error. According to the logic below the interface, I guess it is a string that represents a coin.

2. Hard-coded string constants

- Token name constants are hard-coded. This may lead to typo issues.
- We should define an enum for TokenName:

    ```ts
    export enum TokenName {
        Osmosis = 'Osmosis',
        Ethereum = 'Ethereum',
        Arbitrum = 'Arbitrum',
        Zilliqa = 'Zilliqa',
        Neo = 'Neo'
    }
    ```

    This will help the code be maintainable, more readable.

- Now we should also modify the signature of `getPriority`:

```ts
const getPriority = (blockchain: TokenName) => {
    /// ...
}
```

3. Missing identifiers

Because the given code does not have any import statements. Some missing imports may not be a big deal. Some of them are.

- `BoxProps`: This is just a type identifier. Assume that it is an interface from a UI library.
- `lhsPriority`: This value is used in `sortedBalances`, this may be a mistake intended to refer `balancePriority`. This must be fixed.

4. Unused values and wrong memo logic

- `formattedBalances` computed and never used. We need to remove it.
- Even when `formattedBalances` was just copied here by accident, it is calling `.toFixed` with no arguments. In this case, we need to use a specific argument to format it with fixed number of digits.
- `sortedBalances` is assuming that each row has `.formatted` field. This may leads to undefined formatted value and inconsistent formatted value. Because `formattedBalances` was unused, we assume that the formatting logic is out of this scope and it is correctly synced whenever balance value changes.
- **Critical error**: balances were filtered by `if (balance.amount <= 0)`. That means we only get negative balances. Because there is no documents about why we need to do that, assume that this is a mistake. We can fixed by reversing the comparison: `if (balance.amount >= 0)`
- Now we have a filter function like this:

```tsx
const balancePriority = getPriority(balance.blockchain);
if (balancePriority > -99) {
    if (balance.amount >= 0) {
        return true;
    }
}
return false
```

This can be simplify as follow:

```tsx
const balancePriority = getPriority(balance.blockchain);
return (balancePriority > -99) && (balance.amount >= 0);
```

- The `sort` function returns `undefined` when left value and right value are equal. This is an invalid behavior. It looks like the code is missing a `return 0` statement when two values are equal.
- Then we can remove `else` keyword because we are immediately returning value. This will make the function more readable.

```ts
if (leftPriority > rightPriority) {
    return -1;
} 
if (rightPriority > leftPriority) {
    return 1;
}
return 0;
```

5. Mutating props and wrong use of useMemo:

- `sort` will mutate the array itself, leads to potential bugs. We need to clone the array by `[...balances]` before sorting
- Unexpected `prices` value in dependency list, this will cause unnecessary re-renders
  
6. Unnecessary re-computing priorities

- The code calls `getPriority` inside `filter` and `sort`. This can be optimized by calculating a priority map.

7. Using `index` as React key.

- Using array index as key can cause unnecessary DOM churn when list order changes. Prefer a stable unique key (id)

8. Inefficient USD computing per row

- Similar to priority. This operation is not expensive but we still shoud avoid using it.
