/* eslint-disable no-undef */
// https://eurovisionworld.com/eurovision/2019

// @ts-ignore
copy(
  [
    ...window.document.querySelectorAll(".voting_grid_table td[trid][tdid]")
  ].map(td => ({
    group: [
      ["receiving", td.getAttribute("trid")],
      ["giving", td.getAttribute("tdid")]
    ],
    // @ts-ignore
    value: td.innerText.trim()
      ? // @ts-ignore
        // @ts-ignore
        Number.parseInt(td.innerText.trim(), 10)
      : 0,
    valueType: "number"
  }))
);

// @ts-ignore
copy(
  Array.from(
    new Set(
      [...window.document.querySelectorAll(".voting_grid_table td[trid][tdid]")]
        .map(td => ({
          group: [
            ["receiving", td.getAttribute("trid")],
            ["giving", td.getAttribute("tdid")]
          ],
          // @ts-ignore
          value: td.innerText.trim()
            ? // @ts-ignore
              // @ts-ignore
              Number.parseInt(td.innerText.trim(), 10)
            : 0,
          valueType: "number"
        }))
        .map(e => e.group[0][1])
    )
  )
);

export {};
