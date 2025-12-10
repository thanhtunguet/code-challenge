// Because we assume that the input will always produce a result lesser than Number.MAX_SAFE_INTEGER
// We don't care about the limit of the input
function sum_to_n_c(n) {
    if (n === 1) {
        return 1;
    }
    return n + sum_to_n_c(n - 1);
}