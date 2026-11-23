import React from 'react';
import type { CharacterDesign } from './cast';

const INK = '#3d302a';

type CharacterCostumeProps = {
  roleLabel: string;
  design: CharacterDesign;
  bodyTurn?: number;
};

/** Role-specific tailored outfit details that shift subtly in 3/4 view. */
export const CharacterCostume: React.FC<CharacterCostumeProps> = ({
  roleLabel,
  design,
  bodyTurn = 0,
}) => {
  const shirt = design.outfit;
  const accent = design.accent;
  const skin = design.skin;
  const shift = bodyTurn * 9;

  return (
    <g transform={`translate(${shift} 0)`} stroke={INK}>
      {roleLabel === 'Darto' && (
        <>
          {/* Open work-shirt V-neck & subtle clavicles */}
          <path
            d="M167 183L180 218L193 183Z"
            fill={skin}
            stroke="none"
          />
          <path
            d="M167 185L180 218L193 185"
            fill="none"
            strokeWidth="2.4"
          />
          <path
            d="M173 196q-5 2 -9 1M187 196q5 2 9 1"
            fill="none"
            stroke="rgba(61,48,42,0.36)"
            strokeWidth="1.4"
          />
          {/* Pointed collar lapels */}
          <path
            d="M162 183L153 206L173 209L179 216L166 184Z"
            fill={shirt}
            strokeWidth="2.4"
          />
          <path
            d="M198 183L207 206L187 209L181 216L194 184Z"
            fill={shirt}
            strokeWidth="2.4"
          />
          {/* Stitched center placket & buttons */}
          <path
            d="M177.5 218v110M182.5 218v110"
            fill="none"
            stroke="rgba(61,48,42,0.42)"
            strokeWidth="1.4"
          />
          {[234, 260, 286, 312].map((by) => (
            <circle
              key={by}
              cx="180"
              cy={by}
              r="2.2"
              fill="#d5c5a4"
              strokeWidth="1.2"
            />
          ))}
          {/* Two stitched chest flap pockets */}
          {[142, 193].map((px) => (
            <g key={px}>
              <rect
                x={px}
                y="233"
                width="25"
                height="28"
                rx="2.5"
                fill="rgba(32,48,51,0.12)"
                strokeWidth="2.1"
              />
              <path
                d={`M${px} 233h25l-3 10q-9.5 3 -19 0Z`}
                fill={shirt}
                strokeWidth="2.1"
              />
              <circle
                cx={px + 12.5}
                cy="240"
                r="1.7"
                fill="#d5c5a4"
                strokeWidth="1"
              />
            </g>
          ))}
          {/* Subtle tucked-shirt fabric folds */}
          <path
            d="M156 312q5 9 4 15M204 312q-5 9 -4 15M169 318q3 6 2 10"
            fill="none"
            stroke="rgba(45,35,30,0.34)"
            strokeWidth="1.5"
          />
          {/* Leather belt & brass buckle */}
          <path
            d="M135 328Q180 335 225 328L224 340Q180 347 136 340Z"
            fill="#4e3829"
            strokeWidth="2.6"
          />
          <rect
            x="171"
            y="328"
            width="18"
            height="14"
            rx="2"
            fill={accent}
            strokeWidth="2.1"
          />
          <rect
            x="175.5"
            y="331.5"
            width="9"
            height="7"
            fill="#4e3829"
            strokeWidth="1.2"
          />
        </>
      )}

      {roleLabel === 'Petugas' && (
        <>
          {/* Cream inner blouse V-neck */}
          <path
            d="M167 183L180 238L193 183Z"
            fill="#f2ead8"
            strokeWidth="2.0"
          />
          <path
            d="M171 182L180 202L189 182Z"
            fill={skin}
            stroke="none"
          />
          {/* Tailored shoulder epaulettes */}
          <path
            d="M133 190l22 -7l2 6l-21 7Z"
            fill="#404d59"
            strokeWidth="2.0"
          />
          <circle cx="151" cy="187" r="1.8" fill={accent} strokeWidth="0.9" />
          <path
            d="M227 190l-22 -7l-2 6l21 7Z"
            fill="#404d59"
            strokeWidth="2.0"
          />
          <circle cx="209" cy="187" r="1.8" fill={accent} strokeWidth="0.9" />
          {/* Notched blazer lapels */}
          <path
            d="M162 183L179 239L165 236L160 218L168 214L156 196Z"
            fill="#566674"
            strokeWidth="2.2"
          />
          <path
            d="M198 183L181 239L195 236L200 218L192 214L204 196Z"
            fill="#566674"
            strokeWidth="2.2"
          />
          {/* Blazer center front & buttons */}
          <path
            d="M180 239v98"
            fill="none"
            strokeWidth="2.1"
          />
          {[262, 290].map((by) => (
            <circle
              key={by}
              cx="180"
              cy={by}
              r="2.4"
              fill="#2f3840"
              strokeWidth="1.2"
            />
          ))}
          {/* Waist dart seams & lower pocket flaps */}
          <path
            d="M159 252q4 32 -2 62M201 252q-4 32 2 62"
            fill="none"
            stroke="rgba(45,35,30,0.34)"
            strokeWidth="1.4"
          />
          <path
            d="M148 304h19v5h-19ZM193 304h19v5h-19Z"
            fill="#414f5b"
            strokeWidth="1.8"
          />
          {/* Gold name badge (wearer right) & chest pocket (wearer left) */}
          <rect
            x="146"
            y="236"
            width="20"
            height="8.5"
            rx="1.5"
            fill={accent}
            strokeWidth="1.8"
          />
          <path d="M150 240.2h12" stroke="#6d5630" strokeWidth="1.2" />
          <rect
            x="194"
            y="236"
            width="19"
            height="22"
            rx="2"
            fill="rgba(35,44,52,0.14)"
            strokeWidth="1.9"
          />
          <path d="M194 241h19" strokeWidth="1.5" />
        </>
      )}

      {roleLabel === 'Humas' && (
        <>
          <path d="M143 202h74v140h-74z" fill={shirt} stroke="none" />
          <path
            d="M147 210l14 10-14 10 14 10-14 10m52-40-14 10 14 10-14 10 14 10"
            fill="none"
            stroke={accent}
            strokeWidth="3.2"
          />
          <path d="M173 194v92" stroke="#d5c497" strokeWidth="3.0" />
          <rect
            x="165"
            y="288"
            width="28"
            height="42"
            rx="3"
            fill="#e4d5b1"
            strokeWidth="2.4"
          />
        </>
      )}

      {roleLabel === 'Pak Beni' && (
        <>
          <path
            d="M167 183L180 212L193 183Z"
            fill={skin}
            strokeWidth="2.0"
          />
          <path
            d="M137 200h86l-13 132h-60z"
            fill="#896b49"
            strokeWidth="3.0"
          />
          <path
            d="M146 210l34 40 34-40"
            fill="none"
            stroke={accent}
            strokeWidth="4.2"
          />
          <path d="M180 250v80" fill="none" strokeWidth="2.0" />
          <rect
            x="146"
            y="268"
            width="23"
            height="24"
            rx="2.5"
            fill="#765a3d"
            strokeWidth="2.0"
          />
          <rect
            x="191"
            y="268"
            width="23"
            height="24"
            rx="2.5"
            fill="#765a3d"
            strokeWidth="2.0"
          />
          <path
            d="M225 222q44 8 50 66l-34 14-19-44"
            fill="#71583f"
            strokeWidth="3.2"
          />
        </>
      )}

      {roleLabel === 'Koordinator' && (
        <>
          <path
            d="M143 202h74l-10 130h-54z"
            fill="#456452"
            strokeWidth="2.8"
          />
          <rect
            x="184"
            y="254"
            width="25"
            height="36"
            rx="3"
            fill="#ddc675"
            strokeWidth="2.2"
          />
          <rect
            x="139"
            y="222"
            width="20"
            height="36"
            rx="4"
            fill="#303d3e"
            strokeWidth="2.2"
          />
          <path d="M146 229h9m-9 6h9" stroke="#d4c58f" strokeWidth="2.0" />
        </>
      )}

      {design.apron && (
        <>
          <path
            d="M151 214h58l14 127h-86z"
            fill="#d59b55"
            strokeWidth="3.2"
          />
          <path
            d="M158 272h47v31h-47z"
            fill="#a96e53"
            strokeWidth="2.4"
          />
          <rect
            x="190"
            y="222"
            width="18"
            height="24"
            fill="#efe3c9"
            strokeWidth="2.0"
          />
        </>
      )}

      {roleLabel === 'Manajer' && (
        <>
          <path
            d="M164 192l16 21 16-21-5 54-11 16-11-16z"
            fill="#f1e3c6"
            strokeWidth="2.4"
          />
          <path
            d="M180 236l12 18-12 40-12-40z"
            fill="#9b5549"
            strokeWidth="2.4"
          />
          <path d="M207 210v106" stroke={accent} strokeWidth="2.6" />
          <rect
            x="199"
            y="300"
            width="20"
            height="30"
            fill="#e9dfc6"
            strokeWidth="2.0"
          />
        </>
      )}

      {roleLabel === 'Ayah' && (
        <>
          <path
            d="M147 200l33 32 33-32-10 27-23 24-23-24z"
            fill="#ede3cf"
            strokeWidth="2.4"
          />
          <path d="M180 232v94" stroke={accent} strokeWidth="3.2" />
        </>
      )}

      {roleLabel === 'Dini' && (
        <>
          {/* Rounded cream Peter-Pan collar & cute cardigan buttons */}
          <path
            d="M169 183q5 16 11 17q6 -1 11 -17l6 3q-5 20 -17 19q-12 1 -17 -19Z"
            fill="#f3ead5"
            strokeWidth="2.2"
          />
          <path d="M180 205v120" fill="none" strokeWidth="1.9" />
          {[224, 250, 276].map((by) => (
            <circle
              key={by}
              cx="180"
              cy={by}
              r="2.4"
              fill={accent}
              strokeWidth="1.2"
            />
          ))}
          <rect
            x="151"
            y="284"
            width="16"
            height="19"
            rx="4"
            fill="rgba(50,35,32,0.10)"
            strokeWidth="1.9"
          />
          <rect
            x="193"
            y="284"
            width="16"
            height="19"
            rx="4"
            fill="rgba(50,35,32,0.10)"
            strokeWidth="1.9"
          />
        </>
      )}

      {roleLabel === 'Rika' && (
        <>
          <rect
            x="155"
            y="281"
            width="50"
            height="43"
            rx="4"
            fill="#d8c28f"
            strokeWidth="2.4"
          />
          <path d="M160 290h40m-40 8h40" stroke="#806b4d" strokeWidth="2.0" />
          <rect
            x="184"
            y="214"
            width="21"
            height="25"
            fill="#f2e7ce"
            strokeWidth="2.0"
          />
        </>
      )}

      {roleLabel === 'HR' && (
        <>
          <path
            d="M155 196l25 26 25-26"
            fill="none"
            stroke="#eee0c2"
            strokeWidth="5.0"
          />
          <path d="M180 220v110" stroke={accent} strokeWidth="3.2" />
        </>
      )}

      {roleLabel === 'Influencer' && (
        <>
          <path
            d="M180 202l24 27-24 27-24-27z"
            fill={accent}
            strokeWidth="2.4"
          />
          <rect
            x="195"
            y="292"
            width="27"
            height="34"
            fill="#d7c9ad"
            strokeWidth="2.4"
          />
        </>
      )}

      {roleLabel === 'Nina' && (
        <>
          <path
            d="M152 214l28 28 28-28"
            fill="none"
            stroke={accent}
            strokeWidth="3.6"
          />
          <path d="M180 242v90" fill="none" stroke="rgba(61,48,42,0.35)" strokeWidth="1.8" />
        </>
      )}

      {roleLabel === 'Bendahara' && (
        <>
          <path
            d="M152 198l28 26 28-26"
            fill="none"
            stroke="#e9dfc6"
            strokeWidth="4.5"
          />
          <rect
            x="193"
            y="292"
            width="26"
            height="34"
            fill="#d8c28f"
            strokeWidth="2.4"
          />
        </>
      )}

      {roleLabel === 'Mira' && (
        <>
          <path d="M144 216h72v118h-72z" fill={shirt} stroke="none" />
          <path
            d="M153 231h54v7h-54zM153 251h34v6h-34z"
            fill={accent}
            stroke="none"
          />
        </>
      )}

      {roleLabel === 'Pria' && (
        <>
          <path
            d="M148 206l32 25 32-25"
            fill="none"
            stroke={accent}
            strokeWidth="3.6"
          />
          <path
            d="M146 286h27v38h-27z"
            fill="#527b7e"
            strokeWidth="2.2"
          />
        </>
      )}

      {roleLabel === 'Raka' && (
        <>
          <path
            d="M168 184L180 208L192 184Z"
            fill={skin}
            strokeWidth="2.0"
          />
          <path
            d="M161 184l-6 18l23 6l2 -4zM199 184l6 18l-23 6l-2 -4z"
            fill={shirt}
            strokeWidth="2.2"
          />
          <path
            d="M180 210v116"
            fill="none"
            stroke="rgba(61,48,42,0.45)"
            strokeWidth="1.6"
          />
          <rect
            x="192"
            y="242"
            width="24"
            height="28"
            rx="3"
            fill="#375b61"
            strokeWidth="2.2"
          />
          <path d="M201 235v11" stroke="#d8c083" strokeWidth="2.8" />
          <path
            d="M139 329Q180 335 221 329L220 339Q180 345 140 339Z"
            fill="#3c322b"
            strokeWidth="2.2"
          />
          <rect
            x="173"
            y="329"
            width="14"
            height="11"
            rx="1.5"
            fill="#c9c2b2"
            strokeWidth="1.7"
          />
        </>
      )}

      {roleLabel === 'Nisa' && (
        <>
          <path
            d="M162 192h36l-5 142h-26z"
            fill="#efe3cb"
            strokeWidth="2.2"
          />
          {/* Open terracotta cardigan lapel drape */}
          <path
            d="M162 192L153 334M198 192L207 334"
            fill="none"
            stroke="#8a4d3f"
            strokeWidth="2.8"
          />
          <path
            d="M162 195q6 36 -2 135M198 195q-6 36 2 135"
            fill="none"
            stroke="rgba(120,62,48,0.34)"
            strokeWidth="1.5"
          />
          {[226, 254, 282, 310].map((cy) => (
            <circle
              key={cy}
              cx="180"
              cy={cy}
              r="2.6"
              fill={accent}
              strokeWidth="1.1"
            />
          ))}
        </>
      )}
    </g>
  );
};
