'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
/**
 * Flag geometry, drawn inline on a shared 24 × 18 canvas.
 *
 * Inline rather than emoji on purpose: Windows ships no flag glyphs, so
 * `🇹🇷` renders there as the bare letters "TR" — and Windows is exactly where
 * this menu gets used. Inline rather than an image sprite for the same reason
 * the icons are inline: no extra request, no CSP surface, and both themes get
 * the same crisp 20px mark.
 *
 * These are SIMPLIFIED marks, not heraldry. At 20 × 15 a coat of arms is three
 * muddy pixels, so emblems are reduced to the shape that still reads at that
 * size (Portugal's armillary is a ring, Mexico's eagle a disc). Anything that
 * would be indistinguishable from its neighbour keeps just enough of its
 * emblem to tell them apart — Slovakia, Slovenia and Russia share a
 * white/blue/red field and would otherwise be one flag drawn three times.
 */ /** Equal-height horizontal bands, top to bottom. */ const horizontal = (...colors)=>{
    const height = 18 / colors.length;
    return colors.map((color, index)=>/*#__PURE__*/ _jsx("rect", {
            fill: color,
            height: height,
            width: "24",
            x: "0",
            y: height * index
        }, index));
};
/** Equal-width vertical bands, left to right. */ const vertical = (...colors)=>{
    const width = 24 / colors.length;
    return colors.map((color, index)=>/*#__PURE__*/ _jsx("rect", {
            fill: color,
            height: "18",
            width: width,
            x: width * index,
            y: "0"
        }, index));
};
/** Off-centre Nordic cross, with an optional inner stripe (Norway, Iceland). */ const nordic = (field, cross, inner)=>/*#__PURE__*/ _jsxs(React.Fragment, {
        children: [
            /*#__PURE__*/ _jsx("rect", {
                fill: field,
                height: "18",
                width: "24",
                x: "0",
                y: "0"
            }),
            /*#__PURE__*/ _jsx("rect", {
                fill: cross,
                height: "18",
                width: "4",
                x: "7",
                y: "0"
            }),
            /*#__PURE__*/ _jsx("rect", {
                fill: cross,
                height: "4",
                width: "24",
                x: "0",
                y: "7"
            }),
            inner ? /*#__PURE__*/ _jsxs(React.Fragment, {
                children: [
                    /*#__PURE__*/ _jsx("rect", {
                        fill: inner,
                        height: "18",
                        width: "1.6",
                        x: "8.2",
                        y: "0"
                    }),
                    /*#__PURE__*/ _jsx("rect", {
                        fill: inner,
                        height: "1.6",
                        width: "24",
                        x: "0",
                        y: "8.2"
                    })
                ]
            }) : null
        ]
    });
/** Five-pointed star, point up unless rotated (radians). */ const star = (cx, cy, radius, fill, rotation = 0)=>{
    const points = [];
    for(let index = 0; index < 5; index += 1){
        const outer = rotation + index * 2 * Math.PI / 5 - Math.PI / 2;
        const inner = outer + Math.PI / 5;
        points.push(`${(cx + radius * Math.cos(outer)).toFixed(2)},${(cy + radius * Math.sin(outer)).toFixed(2)}`, `${(cx + radius * 0.382 * Math.cos(inner)).toFixed(2)},${(cy + radius * 0.382 * Math.sin(inner)).toFixed(2)}`);
    }
    return /*#__PURE__*/ _jsx("polygon", {
        fill: fill,
        points: points.join(' ')
    });
};
/** Many-rayed sun (Taiwan): a disc with triangular teeth around it. */ const sunburst = (cx, cy, radius, fill)=>{
    const teeth = [];
    for(let index = 0; index < 12; index += 1){
        const angle = index * 2 * Math.PI / 12;
        const half = Math.PI / 24;
        teeth.push([
            `${(cx + radius * 1.9 * Math.cos(angle)).toFixed(2)},${(cy + radius * 1.9 * Math.sin(angle)).toFixed(2)}`,
            `${(cx + radius * Math.cos(angle - half)).toFixed(2)},${(cy + radius * Math.sin(angle - half)).toFixed(2)}`,
            `${(cx + radius * Math.cos(angle + half)).toFixed(2)},${(cy + radius * Math.sin(angle + half)).toFixed(2)}`
        ].join(' '));
    }
    return /*#__PURE__*/ _jsxs(React.Fragment, {
        children: [
            teeth.map((points, index)=>/*#__PURE__*/ _jsx("polygon", {
                    fill: fill,
                    points: points
                }, index)),
            /*#__PURE__*/ _jsx("circle", {
                cx: cx,
                cy: cy,
                fill: fill,
                r: radius
            })
        ]
    });
};
/** Crescent + star, the Turkish/Azerbaijani arrangement. */ const crescent = (cx, cy, radius, mark, field)=>/*#__PURE__*/ _jsxs(React.Fragment, {
        children: [
            /*#__PURE__*/ _jsx("circle", {
                cx: cx,
                cy: cy,
                fill: mark,
                r: radius
            }),
            /*#__PURE__*/ _jsx("circle", {
                cx: cx + radius * 0.35,
                cy: cy,
                fill: field,
                r: radius * 0.8
            }),
            star(cx + radius * 1.35, cy, radius * 0.49, mark)
        ]
    });
/** The Union flag, reused at half scale inside the Australian canton. */ const unionFlag = /*#__PURE__*/ _jsxs(React.Fragment, {
    children: [
        /*#__PURE__*/ _jsx("rect", {
            fill: "#012169",
            height: "18",
            width: "24",
            x: "0",
            y: "0"
        }),
        /*#__PURE__*/ _jsx("path", {
            d: "M0,0 L24,18 M24,0 L0,18",
            fill: "none",
            stroke: "#FFFFFF",
            strokeWidth: "3.6"
        }),
        /*#__PURE__*/ _jsx("path", {
            d: "M0,0 L24,18 M24,0 L0,18",
            fill: "none",
            stroke: "#C8102E",
            strokeWidth: "1.7"
        }),
        /*#__PURE__*/ _jsx("path", {
            d: "M12,0 V18 M0,9 H24",
            fill: "none",
            stroke: "#FFFFFF",
            strokeWidth: "6"
        }),
        /*#__PURE__*/ _jsx("path", {
            d: "M12,0 V18 M0,9 H24",
            fill: "none",
            stroke: "#C8102E",
            strokeWidth: "3.4"
        })
    ]
});
/** Three stacked bars, rotated — one Korean trigram, simplified to solid. */ const trigram = (cx, cy, degrees)=>/*#__PURE__*/ _jsx("g", {
        transform: `rotate(${degrees} ${cx} ${cy})`,
        children: [
            -1,
            0,
            1
        ].map((offset)=>/*#__PURE__*/ _jsx("rect", {
                fill: "#000000",
                height: "0.62",
                width: "3.4",
                x: cx - 1.7,
                y: cy + offset * 0.95 - 0.31
            }, offset))
    });
/**
 * Region code → geometry. Functions, not elements, so only the flags actually
 * on screen are built.
 */ export const FLAGS = {
    AL: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#E41E20",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("path", {
                    d: "M9.6,4.8 L11,6.4 L11.6,5.5 L12.4,5.5 L13,6.4 L14.4,4.8 L14.1,7 L16.7,7.6 L14.7,8.9 L16.5,10.8 L13.6,10.5 L13.4,12.7 L12,11.5 L10.6,12.7 L10.4,10.5 L7.5,10.8 L9.3,8.9 L7.3,7.6 L9.9,7 Z",
                    fill: "#000000"
                })
            ]
        }),
    AM: ()=>horizontal('#D90012', '#0033A0', '#F2A800'),
    AT: ()=>horizontal('#ED2939', '#FFFFFF', '#ED2939'),
    AU: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#00247D",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("g", {
                    transform: "scale(0.5)",
                    children: unionFlag
                }),
                star(6, 14.4, 1.9, '#FFFFFF'),
                star(17.4, 4.4, 1.1, '#FFFFFF'),
                star(20.4, 8.6, 1.1, '#FFFFFF'),
                star(17.6, 13.2, 1.1, '#FFFFFF'),
                star(14.6, 8.2, 0.8, '#FFFFFF')
            ]
        }),
    AZ: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                horizontal('#00B5E2', '#EF3340', '#509E2F'),
                crescent(11, 9, 2.1, '#FFFFFF', '#EF3340')
            ]
        }),
    BA: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#002F6C",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("path", {
                    d: "M7.5,0 L20,0 L20,18 Z",
                    fill: "#FECB00"
                }),
                [
                    0,
                    1,
                    2,
                    3,
                    4
                ].map((index)=>/*#__PURE__*/ _jsx(React.Fragment, {
                        children: star(6.6 + index * 2.4, 2.2 + index * 3.4, 1, '#FFFFFF')
                    }, index))
            ]
        }),
    BE: ()=>vertical('#000000', '#FAE042', '#ED2939'),
    BG: ()=>horizontal('#FFFFFF', '#00966E', '#D62612'),
    BR: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#009C3B",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("path", {
                    d: "M12,2 L21.8,9 L12,16 L2.2,9 Z",
                    fill: "#FFDF00"
                }),
                /*#__PURE__*/ _jsx("circle", {
                    cx: "12",
                    cy: "9",
                    fill: "#002776",
                    r: "3.5"
                }),
                /*#__PURE__*/ _jsx("path", {
                    d: "M8.9,7.9 A5.4,5.4 0 0,1 15.1,7.6",
                    fill: "none",
                    stroke: "#FFFFFF",
                    strokeWidth: "1"
                })
            ]
        }),
    CA: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#D80621",
                    height: "18",
                    width: "6",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#D80621",
                    height: "18",
                    width: "6",
                    x: "18",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("path", {
                    d: "M12,3.6 L12.9,6.2 L14.6,5.4 L14,7.8 L16.4,7.4 L15.2,8.7 L16.6,9.6 L13.3,10.1 L13.7,11.6 L12.4,11.2 L12.6,14.4 L11.4,14.4 L11.6,11.2 L10.3,11.6 L10.7,10.1 L7.4,9.6 L8.8,8.7 L7.6,7.4 L10,7.8 L9.4,5.4 L11.1,6.2 Z",
                    fill: "#D80621"
                })
            ]
        }),
    CH: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#D52B1E",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "10",
                    width: "3.6",
                    x: "10.2",
                    y: "4"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "3.6",
                    width: "10",
                    x: "7",
                    y: "7.2"
                })
            ]
        }),
    CN: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#DE2910",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                star(5.4, 5.4, 3, '#FFDE00'),
                star(10.4, 2.4, 1.1, '#FFDE00', 0.35),
                star(12.2, 4.9, 1.1, '#FFDE00', 0.75),
                star(12.2, 7.9, 1.1, '#FFDE00', 1.15),
                star(10.2, 10.2, 1.1, '#FFDE00', 0.35)
            ]
        }),
    CZ: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "9",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#D7141A",
                    height: "9",
                    width: "24",
                    x: "0",
                    y: "9"
                }),
                /*#__PURE__*/ _jsx("path", {
                    d: "M0,0 L11,9 L0,18 Z",
                    fill: "#11457E"
                })
            ]
        }),
    DE: ()=>horizontal('#000000', '#DD0000', '#FFCE00'),
    DK: ()=>nordic('#C8102E', '#FFFFFF'),
    EE: ()=>horizontal('#0072CE', '#000000', '#FFFFFF'),
    ES: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#AA151B",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#F1BF00",
                    height: "9",
                    width: "24",
                    x: "0",
                    y: "4.5"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#AA151B",
                    height: "4.6",
                    rx: "0.6",
                    width: "3.2",
                    x: "4.4",
                    y: "6.7"
                })
            ]
        }),
    FI: ()=>nordic('#FFFFFF', '#003580'),
    FR: ()=>vertical('#002395', '#FFFFFF', '#ED2939'),
    GB: ()=>unionFlag,
    GE: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("path", {
                    d: "M10.4,0 H13.6 V18 H10.4 Z M0,7.4 H24 V10.6 H0 Z",
                    fill: "#FF0000"
                }),
                [
                    [
                        5,
                        3.4
                    ],
                    [
                        19,
                        3.4
                    ],
                    [
                        5,
                        14.6
                    ],
                    [
                        19,
                        14.6
                    ]
                ].map(([cx, cy], index)=>/*#__PURE__*/ _jsx("path", {
                        d: `M${cx - 1.3},${cy} H${cx + 1.3} M${cx},${cy - 1.3} V${cy + 1.3}`,
                        fill: "none",
                        stroke: "#FF0000",
                        strokeWidth: "0.9"
                    }, index))
            ]
        }),
    GR: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                [
                    0,
                    2,
                    4,
                    6,
                    8
                ].map((row)=>/*#__PURE__*/ _jsx("rect", {
                        fill: "#0D5EAF",
                        height: "2",
                        width: "24",
                        x: "0",
                        y: row * 2
                    }, row)),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#0D5EAF",
                    height: "10",
                    width: "10",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "10",
                    width: "2",
                    x: "4",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "2",
                    width: "10",
                    x: "0",
                    y: "4"
                })
            ]
        }),
    HR: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                horizontal('#FF0000', '#FFFFFF', '#171796'),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "5.4",
                    stroke: "#FF0000",
                    strokeWidth: "0.5",
                    width: "5.6",
                    x: "9.2",
                    y: "5"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FF0000",
                    height: "1.35",
                    width: "1.4",
                    x: "9.2",
                    y: "5"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FF0000",
                    height: "1.35",
                    width: "1.4",
                    x: "12",
                    y: "5"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FF0000",
                    height: "1.35",
                    width: "1.4",
                    x: "10.6",
                    y: "6.35"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FF0000",
                    height: "1.35",
                    width: "1.4",
                    x: "13.4",
                    y: "6.35"
                })
            ]
        }),
    HU: ()=>horizontal('#CE2939', '#FFFFFF', '#477050'),
    ID: ()=>horizontal('#FF0000', '#FFFFFF'),
    IL: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#0038B8",
                    height: "2.1",
                    width: "24",
                    x: "0",
                    y: "2.6"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#0038B8",
                    height: "2.1",
                    width: "24",
                    x: "0",
                    y: "13.3"
                }),
                /*#__PURE__*/ _jsx("path", {
                    d: "M12,5.5 L15,10.7 L9,10.7 Z M12,12.5 L9,7.3 L15,7.3 Z",
                    fill: "none",
                    stroke: "#0038B8",
                    strokeWidth: "0.72"
                })
            ]
        }),
    IN: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                horizontal('#FF9933', '#FFFFFF', '#138808'),
                /*#__PURE__*/ _jsx("circle", {
                    cx: "12",
                    cy: "9",
                    fill: "none",
                    r: "2.2",
                    stroke: "#000080",
                    strokeWidth: "0.7"
                })
            ]
        }),
    IR: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                horizontal('#239F40', '#FFFFFF', '#DA0000'),
                /*#__PURE__*/ _jsx("path", {
                    d: "M12,7.2 L13.3,9.4 L12,10.8 L10.7,9.4 Z",
                    fill: "#DA0000"
                })
            ]
        }),
    IS: ()=>nordic('#02529C', '#FFFFFF', '#DC1E35'),
    IT: ()=>vertical('#009246', '#FFFFFF', '#CE2B37'),
    JP: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("circle", {
                    cx: "12",
                    cy: "9",
                    fill: "#BC002D",
                    r: "5.2"
                })
            ]
        }),
    KR: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("circle", {
                    cx: "12",
                    cy: "9",
                    fill: "#CD2E3A",
                    r: "4"
                }),
                /*#__PURE__*/ _jsx("path", {
                    d: "M8,9 A2,2 0 0,1 12,9 A2,2 0 0,0 16,9 A4,4 0 0,1 8,9 Z",
                    fill: "#0047A0"
                }),
                trigram(4.2, 3.6, 34),
                trigram(19.8, 3.6, -34),
                trigram(4.2, 14.4, -34),
                trigram(19.8, 14.4, 34)
            ]
        }),
    LT: ()=>horizontal('#FDB913', '#006A44', '#C1272D'),
    LV: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#9E3039",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "3.6",
                    width: "24",
                    x: "0",
                    y: "7.2"
                })
            ]
        }),
    MK: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#D20000",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7
                ].map((index)=>/*#__PURE__*/ _jsx("path", {
                        d: `M12,9 L${(12 + 26 * Math.cos(index * Math.PI / 4 - 0.16)).toFixed(2)},${(9 + 26 * Math.sin(index * Math.PI / 4 - 0.16)).toFixed(2)} L${(12 + 26 * Math.cos(index * Math.PI / 4 + 0.16)).toFixed(2)},${(9 + 26 * Math.sin(index * Math.PI / 4 + 0.16)).toFixed(2)} Z`,
                        fill: "#FFE600"
                    }, index)),
                /*#__PURE__*/ _jsx("circle", {
                    cx: "12",
                    cy: "9",
                    fill: "#FFE600",
                    r: "2.6"
                }),
                /*#__PURE__*/ _jsx("circle", {
                    cx: "12",
                    cy: "9",
                    fill: "#D20000",
                    r: "1.9"
                })
            ]
        }),
    MX: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                vertical('#006847', '#FFFFFF', '#CE1126'),
                /*#__PURE__*/ _jsx("circle", {
                    cx: "12",
                    cy: "9",
                    fill: "none",
                    r: "1.9",
                    stroke: "#8C6239",
                    strokeWidth: "0.85"
                })
            ]
        }),
    MY: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                ].map((index)=>/*#__PURE__*/ _jsx("rect", {
                        fill: "#CC0001",
                        height: 18 / 14,
                        width: "24",
                        x: "0",
                        y: index * 18 / 7
                    }, index)),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#010066",
                    height: "10.3",
                    width: "13.7",
                    x: "0",
                    y: "0"
                }),
                crescent(5.6, 5.2, 2.1, '#FFCC00', '#010066')
            ]
        }),
    NL: ()=>horizontal('#AE1C28', '#FFFFFF', '#21468B'),
    NO: ()=>nordic('#BA0C2F', '#FFFFFF', '#00205B'),
    PK: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#01411C",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "18",
                    width: "6",
                    x: "0",
                    y: "0"
                }),
                crescent(14.4, 9, 3.1, '#FFFFFF', '#01411C')
            ]
        }),
    PL: ()=>horizontal('#FFFFFF', '#DC143C'),
    PT: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FF0000",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#006600",
                    height: "18",
                    width: "9.6",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("circle", {
                    cx: "9.6",
                    cy: "9",
                    fill: "none",
                    r: "3.1",
                    stroke: "#FFD700",
                    strokeWidth: "1"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "3",
                    rx: "0.4",
                    stroke: "#FF0000",
                    strokeWidth: "0.6",
                    width: "2.6",
                    x: "8.3",
                    y: "7.5"
                })
            ]
        }),
    RO: ()=>vertical('#002B7F', '#FCD116', '#CE1126'),
    RS: ()=>horizontal('#C6363C', '#0C4076', '#FFFFFF'),
    RU: ()=>horizontal('#FFFFFF', '#0039A6', '#D52B1E'),
    SA: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#165D31",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "0.9",
                    rx: "0.45",
                    width: "14",
                    x: "5",
                    y: "6"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "0.9",
                    rx: "0.45",
                    width: "11",
                    x: "6.5",
                    y: "8"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "1",
                    rx: "0.5",
                    width: "15",
                    x: "4.5",
                    y: "11.4"
                })
            ]
        }),
    SE: ()=>nordic('#006AA7', '#FECC00'),
    SI: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                horizontal('#FFFFFF', '#0000A0', '#DE2E36'),
                /*#__PURE__*/ _jsx("path", {
                    d: "M4.6,3.2 H9.4 V6.4 L7,8.6 L4.6,6.4 Z",
                    fill: "#FFFFFF",
                    stroke: "#0000A0",
                    strokeWidth: "0.6"
                }),
                /*#__PURE__*/ _jsx("path", {
                    d: "M7,4.2 L8.5,6.6 H5.5 Z",
                    fill: "#0000A0"
                })
            ]
        }),
    SK: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                horizontal('#FFFFFF', '#0B4EA2', '#EE1C25'),
                /*#__PURE__*/ _jsx("path", {
                    d: "M5.4,4.6 H10.6 V9.2 C10.6,11 9.2,12.2 8,12.6 C6.8,12.2 5.4,11 5.4,9.2 Z",
                    fill: "#EE1C25",
                    stroke: "#FFFFFF",
                    strokeWidth: "0.7"
                }),
                /*#__PURE__*/ _jsx("path", {
                    d: "M8,6.2 V10.4 M6.4,7.8 H9.6",
                    fill: "none",
                    stroke: "#FFFFFF",
                    strokeWidth: "0.9"
                })
            ]
        }),
    TH: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#A51931",
                    height: "3",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#F4F5F8",
                    height: "3",
                    width: "24",
                    x: "0",
                    y: "3"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#2D2A4A",
                    height: "6",
                    width: "24",
                    x: "0",
                    y: "6"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#F4F5F8",
                    height: "3",
                    width: "24",
                    x: "0",
                    y: "12"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#A51931",
                    height: "3",
                    width: "24",
                    x: "0",
                    y: "15"
                })
            ]
        }),
    TR: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#E30A17",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                crescent(9.4, 9, 4.2, '#FFFFFF', '#E30A17')
            ]
        }),
    TW: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FE0000",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#000095",
                    height: "9",
                    width: "12",
                    x: "0",
                    y: "0"
                }),
                sunburst(6, 4.5, 1.5, '#FFFFFF'),
                /*#__PURE__*/ _jsx("circle", {
                    cx: "6",
                    cy: "4.5",
                    fill: "#000095",
                    r: "0.75"
                })
            ]
        }),
    UA: ()=>horizontal('#0057B7', '#FFDD00'),
    US: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#FFFFFF",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                ].map((index)=>/*#__PURE__*/ _jsx("rect", {
                        fill: "#B31942",
                        height: 18 / 13,
                        width: "24",
                        x: "0",
                        y: index * 2 * 18 / 13
                    }, index)),
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#0A3161",
                    height: 7 * 18 / 13,
                    width: "9.6",
                    x: "0",
                    y: "0"
                }),
                [
                    0,
                    1,
                    2,
                    3
                ].map((row)=>[
                        0,
                        1,
                        2,
                        3,
                        4
                    ].map((column)=>/*#__PURE__*/ _jsx("circle", {
                            cx: 1.1 + column * 1.9 + row % 2 * 0.95,
                            cy: 1.3 + row * 2.4,
                            fill: "#FFFFFF",
                            r: "0.42"
                        }, `${row}-${column}`)))
            ]
        }),
    VN: ()=>/*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                /*#__PURE__*/ _jsx("rect", {
                    fill: "#DA251D",
                    height: "18",
                    width: "24",
                    x: "0",
                    y: "0"
                }),
                star(12, 9, 4.4, '#FFFF00')
            ]
        })
};
