import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

const SVGIcons = {
  home: (
    <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <G id="house-chimney-2 1" clip-path="url(#clip0_1262_123)">
              <Path
                id="Vector"
                d="M3.75391 13.923V22.173H9.75391V16.173C9.75391 15.7751 9.91194 15.3936 10.1932 15.1123C10.4746 14.831 10.8561 14.673 11.2539 14.673H12.7539C13.1517 14.673 13.5333 14.831 13.8146 15.1123C14.0959 15.3936 14.2539 15.7751 14.2539 16.173V22.173H20.2539V13.923"
                stroke="white"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <Path
                id="Vector_2"
                d="M0.753906 12.423L10.9439 2.23398C11.2252 1.95277 11.6067 1.7948 12.0044 1.7948C12.4022 1.7948 12.7836 1.95277 13.0649 2.23398L23.2539 12.423"
                stroke="white"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <Path
                id="Vector_3"
                d="M16.5039 5.67297V4.17297H20.2539V9.42297"
                stroke="white"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </G>
            <Defs>
              <ClipPath id="clip0_1262_123">
                <Rect width="24" height="24" fill="white" />
              </ClipPath>
            </Defs>
    </Svg>
  ),  
  categories: (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <G id="Catagories">
        <Path
          id="shape"
          d="M3 2C2.44772 2 2 2.44772 2 3V6.71429C2 7.26657 2.44772 7.71429 3 7.71429H6.70215C7.25444 7.71429 7.70215 7.26657 7.70215 6.71428V3C7.70215 2.44772 7.25444 2 6.70215 2H3ZM2 10.1431C2 9.59078 2.44772 9.14307 3 9.14307H6.70215C7.25444 9.14307 7.70215 9.59078 7.70215 10.1431V13.8574C7.70215 14.4096 7.25444 14.8574 6.70215 14.8574H3C2.44772 14.8574 2 14.4096 2 13.8574V10.1431ZM2 17.2856C2 16.7334 2.44772 16.2856 3 16.2856H6.70215C7.25444 16.2856 7.70215 16.7334 7.70215 17.2856V20.9999C7.70215 21.5522 7.25444 21.9999 6.70215 21.9999H3C2.44772 21.9999 2 21.5522 2 20.9999V17.2856ZM9.14893 17.2856C9.14893 16.7334 9.59664 16.2856 10.1489 16.2856H13.8511C14.4034 16.2856 14.8511 16.7334 14.8511 17.2856V20.9999C14.8511 21.5522 14.4034 21.9999 13.8511 21.9999H10.1489C9.59664 21.9999 9.14893 21.5522 9.14893 20.9999V17.2856ZM10.1489 9.14307C9.59664 9.14307 9.14893 9.59078 9.14893 10.1431V13.8574C9.14893 14.4096 9.59664 14.8574 10.1489 14.8574H13.8511C14.4034 14.8574 14.8511 14.4096 14.8511 13.8574V10.1431C14.8511 9.59078 14.4034 9.14307 13.8511 9.14307H10.1489ZM9.14893 3C9.14893 2.44772 9.59664 2 10.1489 2H13.8511C14.4034 2 14.8511 2.44772 14.8511 3V6.71428C14.8511 7.26657 14.4034 7.71429 13.8511 7.71429H10.1489C9.59664 7.71429 9.14893 7.26657 9.14893 6.71429V3ZM17.2979 16.2856C16.7456 16.2856 16.2979 16.7334 16.2979 17.2856V20.9999C16.2979 21.5522 16.7456 21.9999 17.2979 21.9999H21C21.5523 21.9999 22 21.5522 22 20.9999V17.2856C22 16.7334 21.5523 16.2856 21 16.2856H17.2979ZM16.2979 10.1431C16.2979 9.59078 16.7456 9.14307 17.2979 9.14307H21C21.5523 9.14307 22 9.59078 22 10.1431V13.8574C22 14.4096 21.5523 14.8574 21 14.8574H17.2979C16.7456 14.8574 16.2979 14.4096 16.2979 13.8574V10.1431ZM17.2979 2C16.7456 2 16.2979 2.44772 16.2979 3V6.71429C16.2979 7.26657 16.7456 7.71429 17.2979 7.71429H21C21.5523 7.71429 22 7.26657 22 6.71428V3C22 2.44772 21.5523 2 21 2H17.2979Z"
          fill="white"
        />
      </G>
    </Svg>
  ),
  cogs:(
    <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <G id="24/cogs">
      <Path
        id="shape"
        d="M5.19173 6.91007L7.41081 7.34504L7.95333 6.91279C8.45453 6.51347 9.01525 6.18719 9.61939 5.94928L10.2642 5.69534L10.9962 3.5585C11.3249 3.5199 11.6599 3.5 12 3.5C12.3401 3.5 12.675 3.5199 13.0037 3.55849L13.7358 5.69542L14.3805 5.94937C14.9846 6.18728 15.5453 6.51354 16.0464 6.91283L16.5889 7.34508L18.8083 6.91006C19.2086 7.44444 19.5471 8.02701 19.8136 8.64715L18.3275 10.3513L18.429 11.0358C18.4756 11.3496 18.4999 11.6715 18.4999 12C18.4999 12.3285 18.4756 12.6504 18.429 12.9642L18.3275 13.6487L19.8136 15.3528C19.5471 15.973 19.2086 16.5556 18.8083 17.0899L16.5889 16.6549L16.0464 17.0872C15.5453 17.4865 14.9846 17.8127 14.3805 18.0506L13.7358 18.3046L13.0037 20.4415C12.675 20.4801 12.3401 20.5 12 20.5C11.6599 20.5 11.3249 20.4801 10.9962 20.4415L10.2642 18.3047L9.61939 18.0507C9.01525 17.8128 8.45453 17.4865 7.95333 17.0872L7.41081 16.655L5.19173 17.0899C4.79145 16.5555 4.45294 15.9729 4.18642 15.3528L5.6723 13.6489L5.57069 12.9644C5.52411 12.6505 5.49985 12.3285 5.49985 12C5.49985 11.6715 5.52411 11.3495 5.57069 11.0356L5.6723 10.3511L4.18642 8.64721C4.45294 8.02705 4.79145 7.44447 5.19173 6.91007ZM7.01863 5.73962L5.1588 5.37507C4.81584 5.30785 4.45969 5.42217 4.23913 5.69326C3.5756 6.50878 3.03804 7.4309 2.6561 8.42995C2.53128 8.75646 2.61037 9.12218 2.84011 9.38563L4.08695 10.8154C4.02957 11.2019 3.99985 11.5975 3.99985 12C3.99985 12.4025 4.02957 12.7981 4.08695 13.1846L2.84011 14.6144C2.61037 14.8778 2.53128 15.2435 2.6561 15.57C3.03804 16.5691 3.5756 17.4912 4.23913 18.3067C4.45969 18.5778 4.81585 18.6922 5.1588 18.6249L7.01863 18.2604C7.63474 18.7513 8.32495 19.1531 9.06977 19.4464L9.68369 21.2385C9.79711 21.5696 10.0748 21.8211 10.4204 21.876C10.935 21.9576 11.4625 22 12 22C12.5375 22 13.065 21.9576 13.5795 21.876C13.9251 21.8211 14.2028 21.5696 14.3163 21.2385L14.9302 19.4463C15.675 19.153 16.3651 18.7512 16.9811 18.2603L18.8412 18.6249C19.1842 18.6922 19.5403 18.5778 19.7609 18.3068C20.4244 17.4912 20.962 16.5692 21.3439 15.5701C21.4687 15.2436 21.3896 14.8779 21.1599 14.6144L19.9128 13.1843C19.9701 12.7979 19.9998 12.4024 19.9998 12C19.9998 11.5976 19.9701 11.2021 19.9128 10.8157L21.1599 9.38556C21.3896 9.12211 21.4687 8.75639 21.3439 8.42988C20.962 7.43085 20.4244 6.50875 19.7609 5.69325C19.5403 5.42216 19.1842 5.30784 18.8412 5.37506L16.9811 5.73966C16.3651 5.24883 15.675 4.84702 14.9302 4.55371L14.3163 2.76147C14.2028 2.43039 13.9251 2.17888 13.5795 2.12403C13.065 2.0424 12.5375 2 12 2C11.4625 2 10.935 2.0424 10.4204 2.12405C10.0748 2.1789 9.79711 2.4304 9.68369 2.76149L9.06977 4.5536C8.32495 4.84691 7.63474 5.24875 7.01863 5.73962ZM9.24988 12C9.24988 10.4812 10.4811 9.25 11.9999 9.25C13.5187 9.25 14.7499 10.4812 14.7499 12C14.7499 13.5188 13.5187 14.75 11.9999 14.75C10.4811 14.75 9.24988 13.5188 9.24988 12ZM11.9999 7.75C9.65267 7.75 7.74988 9.65279 7.74988 12C7.74988 14.3472 9.65267 16.25 11.9999 16.25C14.3471 16.25 16.2499 14.3472 16.2499 12C16.2499 9.65279 14.3471 7.75 11.9999 7.75Z"
        fill="white"
      />
    </G>
  </Svg>
  ),
  creaditCard:(
    <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <G id="24/credit-card">
      <Path
        id="shape"
        d="M3 6C2.72386 6 2.5 6.22386 2.5 6.5V9L21.5 9V6.5C21.5 6.22386 21.2761 6 21 6H3ZM2.5 12V17.5C2.5 17.7761 2.72386 18 3 18H21C21.2761 18 21.5 17.7761 21.5 17.5V12L2.5 12ZM1 6.5C1 5.39543 1.89543 4.5 3 4.5H21C22.1045 4.5 23 5.39543 23 6.5V17.5C23 18.6046 22.1045 19.5 21 19.5H3C1.89543 19.5 1 18.6046 1 17.5V6.5Z"
        fill="white"
      />
    </G>
  </Svg>
  ),
  order:(
    <Svg
    width={24}
    height={23}
    viewBox="0 0 24 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <G id="Add order">
      <Path
        id="shape"
        d="M5.75 2.5C4.50736 2.5 3.5 3.50736 3.5 4.75V7.75C3.5 8.99264 4.50736 10 5.75 10H18.25C19.4926 10 20.5 8.99264 20.5 7.75V4.75C20.5 3.50736 19.4926 2.5 18.25 2.5H5.75ZM5 4.75C5 4.33579 5.33579 4 5.75 4H18.25C18.6642 4 19 4.33579 19 4.75V7.75C19 8.16421 18.6642 8.5 18.25 8.5H5.75C5.33579 8.5 5 8.16421 5 7.75V4.75ZM6 12.75C6 12.3358 6.33579 12 6.75 12H18.25C19.4927 12 20.5 13.0074 20.5 14.25V17.25C20.5 18.4926 19.4927 19.5 18.25 19.5H10.75C10.3358 19.5 10 19.1642 10 18.75C10 18.3358 10.3358 18 10.75 18H18.25C18.6643 18 19 17.6642 19 17.25V14.25C19 13.8358 18.6643 13.5 18.25 13.5H6.75C6.33579 13.5 6 13.1642 6 12.75ZM5 15.25C5 14.8358 4.66421 14.5 4.25 14.5C3.83579 14.5 3.5 14.8358 3.5 15.25L3.5 18H0.75C0.335786 18 0 18.3358 0 18.75C0 19.1642 0.335786 19.5 0.75 19.5H3.49999L3.49999 22.25C3.49999 22.6642 3.83578 23 4.24999 23C4.6642 23 4.99999 22.6642 4.99999 22.25L4.99999 19.5H7.75C8.16421 19.5 8.5 19.1642 8.5 18.75C8.5 18.3358 8.16421 18 7.75 18H5L5 15.25Z"
        fill="white"
      />
    </G>
  </Svg>
  ),
  owner:(
    <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <G id="24/owner">
      <G id="shape">
        <Path
          d="M22 12C22 12.9503 21.8675 13.8696 21.6198 14.7405C21.1933 14.4776 20.7242 14.2769 20.2254 14.1513C20.4046 13.4642 20.5 12.7432 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.0748 4.24343 15.976 5.4784 17.4517C6.43611 18.5961 7.68935 19.4847 9.12087 20C10.02 20.3236 10.9894 20.5 12 20.5C12.7432 20.5 13.4642 20.4046 14.1513 20.2254C14.2769 20.7242 14.4776 21.1933 14.7405 21.6198C13.8696 21.8675 12.9503 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
          fill="white"
        />
        <Path
          d="M12.0001 13C13.7239 13 15.3021 13.6231 16.5219 14.6563C15.0948 15.4722 14.1085 16.9711 14.0084 18.7076C13.3723 18.8978 12.6981 19 12.0001 19C9.62135 19 7.51973 17.8135 6.25478 16C7.51973 14.1865 9.62135 13 12.0001 13Z"
          fill="white"
        />
        <Path
          d="M12.0001 5C10.3432 5 9.00009 6.34315 9.00009 8C9.00009 9.65685 10.3432 11 12.0001 11C13.6569 11 15.0001 9.65685 15.0001 8C15.0001 6.34315 13.6569 5 12.0001 5Z"
          fill="white"
        />
        <Path
          d="M19.1794 15.0115C19.106 14.8628 18.894 14.8628 18.8207 15.0115L17.7412 17.1988C17.712 17.2578 17.6557 17.2987 17.5906 17.3082L15.1768 17.6589C15.0127 17.6828 14.9472 17.8844 15.0659 18.0001L16.8126 19.7026C16.8597 19.7486 16.8812 19.8148 16.8701 19.8797L16.4578 22.2837C16.4297 22.4471 16.6012 22.5717 16.748 22.4946L18.9069 21.3595C18.9652 21.3289 19.0348 21.3289 19.0931 21.3595L21.2521 22.4946C21.3988 22.5717 21.5703 22.4471 21.5422 22.2837L21.1299 19.8797C21.1188 19.8148 21.1403 19.7486 21.1874 19.7026L22.9341 18.0001C23.0528 17.8844 22.9873 17.6828 22.8232 17.6589L20.4094 17.3082C20.3443 17.2987 20.288 17.2578 20.2588 17.1988L19.1794 15.0115Z"
          fill="white"
        />
      </G>
    </G>
  </Svg>
  ),
  profile:( 
    <Svg
    width={24}
    height={20}
    viewBox="0 0 24 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <G id="profile">
      <Path
        id="shape"
        d="M9.5 5C9.5 3.61929 10.6193 2.5 12 2.5C13.3807 2.5 14.5 3.61929 14.5 5C14.5 6.38071 13.3807 7.5 12 7.5C10.6193 7.5 9.5 6.38071 9.5 5ZM12 1C9.79086 1 8 2.79086 8 5C8 7.20914 9.79086 9 12 9C14.2091 9 16 7.20914 16 5C16 2.79086 14.2091 1 12 1ZM5.30926 17.3512C5.74823 14.0485 8.57712 11.5 12 11.5C15.4229 11.5 18.2518 14.0485 18.6908 17.3512C18.6949 17.3824 18.688 17.4085 18.6603 17.4373C18.6284 17.4705 18.5723 17.5 18.5 17.5H5.50003C5.42777 17.5 5.37162 17.4705 5.33973 17.4373C5.31209 17.4085 5.30512 17.3824 5.30926 17.3512ZM12 10C7.81514 10 4.35907 13.1153 3.82234 17.1536C3.68095 18.2174 4.56443 19 5.50003 19H18.5C19.4356 19 20.3191 18.2174 20.1777 17.1536C19.641 13.1153 16.1849 10 12 10Z"
        fill="white"
      />
    </G>
  </Svg>
  ),
  webforms:(
    <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <G id="24/webforms">
      <Path
        id="shape"
        d="M19 3.5C19.2761 3.5 19.5 3.72386 19.5 4V20C19.5 20.2761 19.2761 20.5 19 20.5H5C4.72386 20.5 4.5 20.2761 4.5 20V4C4.5 3.72386 4.72386 3.5 5 3.5H19ZM5 2C3.89543 2 3 2.89543 3 4V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V4C21 2.89543 20.1046 2 19 2H5ZM6 11C6 10.7239 6.22386 10.5 6.5 10.5H8.5C8.77614 10.5 9 10.7239 9 11V13C9 13.2761 8.77614 13.5 8.5 13.5H6.5C6.22386 13.5 6 13.2761 6 13V11ZM6.5 5.5C6.22386 5.5 6 5.72386 6 6V8C6 8.27614 6.22386 8.5 6.5 8.5H8.5C8.77614 8.5 9 8.27614 9 8V6C9 5.72386 8.77614 5.5 8.5 5.5H6.5ZM11 7C11 6.58579 11.3358 6.25 11.75 6.25H17.25C17.6642 6.25 18 6.58579 18 7C18 7.41421 17.6642 7.75 17.25 7.75H11.75C11.3358 7.75 11 7.41421 11 7ZM11.75 11.25H17.25C17.6642 11.25 18 11.5858 18 12C18 12.4142 17.6642 12.75 17.25 12.75H11.75C11.3358 12.75 11 12.4142 11 12C11 11.5858 11.3358 11.25 11.75 11.25ZM6 16C6 15.7239 6.22386 15.5 6.5 15.5H8.5C8.77614 15.5 9 15.7239 9 16V18C9 18.2761 8.77614 18.5 8.5 18.5H6.5C6.22386 18.5 6 18.2761 6 18V16ZM11.75 16.25C11.3358 16.25 11 16.5858 11 17C11 17.4142 11.3358 17.75 11.75 17.75H17.25C17.6642 17.75 18 17.4142 18 17C18 16.5858 17.6642 16.25 17.25 16.25H11.75Z"
        fill="white"
      />
    </G>
  </Svg>
  ),
  dashBoard:(
    <Svg width={24} height={24} viewBox="0 0 32 32">
      <Rect x={24} y={21} width={2} height={5} fill="#000000" />
      <Rect x={20} y={16} width={2} height={10} fill="#000000" />
      <Path
        d="M11,26a5.0059,5.0059,0,0,1-5-5H8a3,3,0,1,0,3-3V16a5,5,0,0,1,0,10Z"
        fill="#000000"
      />
      <Path
        d="M28,2H4A2.002,2.002,0,0,0,2,4V28a2.0023,2.0023,0,0,0,2,2H28a2.0027,2.0027,0,0,0,2-2V4A2.0023,2.0023,0,0,0,28,2Zm0,9H14V4H28ZM12,4v7H4V4ZM4,28V13H28.0007l.0013,15Z"
        fill="#000000"
      />
    </Svg>
  ),
  chat:(
    <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M8 12H8.009M11.991 12H12M15.991 12H16"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
  ),
  back:(
    <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M8 12H8.009M11.991 12H12M15.991 12H16"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
  ),
};

export default SVGIcons;
