import { useEffect, useState } from "react";
import { Interface } from "readline";

interface TrackingDetail {
  kind: string;
  level: number;
  manName: string;
  manPic: string;
  telno: string;
  telno2: string;
  time: number;
  timeString: string;
  where: string;
  code: string | null;
  remark: string | null;
}

interface PackageData {
  adUrl: string;
  complete: boolean;
  invoiceNo: string;
  itemImage: string;
  itemName: string;
  level: number;
  receiverAddr: string;
  receiverName: string;
  recipient: string;
  result: string;
  senderName: string;
  trackingDetails: TrackingDetail[];
  orderNumber: string | null;
  estimate: string | null;
  productInfo: string | null;
  zipCode: string | null;
  lastDetail: TrackingDetail;
  lastStateDetail: TrackingDetail;
  firstDetail: TrackingDetail;
  completeYN: string;
}



interface Company {
  International: string;
  Code: string;
  Name: string
}


interface ThemeColor {
  // 중첩 객체에서는 번호가 아니라 배열 대괄호의 이름임 ex themeColor['blue'].text 이런 방식이라 배열이기 때문에 key값이 string이다.
  // 중첩 객체에서는 index값을 못씀 
  [key: string]: {
    back: string;
    hover: string;
    active: string;
    text: string;
    outline: string;

    odd: string;
    after: string;
    border: string;
    rgb: string;

  }

}




interface ButtonType {
  name: string;
  theme: string;


}

function App() {
  // const [test, setTest] = useState<string>();
  //모든데이터
  const [allCarriers, setAllCarriers] = useState<Company[]>([]);
  // 필터되는 데이터
  const [carriers, setCarriers] = useState<Company[]>([]);
  const [theme, setTheme] = useState<string>('default');
  // 04대한통운을 기본으로 택배사 코드
  const [tcode, setTcode] = useState<string>('04');
  // 실제 운송장 번호
  const [tinvoice, setTinvoice] = useState<string>('');
  //택배사 이름
  const [tname, setTname] = useState<string>('CJ대한통운');
  const [isBtn, setIsBtn] = useState<number | null>(null);
  const [infoTracking, setInfoTracking] = useState<PackageData | null>(null);
  // const [infoTracking, setInfoTracking] = useState<PackageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [error, setError] = useState<string>('');



  const themeColor: ThemeColor = {
    "default": {
      "back": "bg-indigo-500",
      "hover": "hover:bg-indigo-300",
      "active": "bg-indigo-400",
      "text": "text-indigo-500",
      "outline": "outline-indigo-300",
      "odd": "odd:bg-indigo-50",
      "after": "after:bg-indigo-500",
      "border": "border-bg-indigo-300",
      "rgb": "#6366f1"

    },
    "orange": {
      "back": "bg-orange-500",
      "hover": "hover:bg-orange-300",
      "active": "bg-orange-400",
      "text": "text-orange-500",
      "outline": "outline-orange-300",
      "odd": "odd:bg-orange-50",
      "after": "after:bg-orange-500",
      "border": "border-bg-orange-300",
      "rgb": "#f97163"
    },
    "blue": {
      "back": "bg-blue-500",
      "hover": "hover:bg-blue-300",
      "active": "bg-blue-400",
      "text": "text-blue-500",
      "outline": "outline-blue-300",
      "odd": "odd:bg-blue-50",
      "after": "after:bg-blue-500",
      "border": "border-bg-blue-300",
      "rgb": "#3b82f6"
    }
  }

  const buttons: ButtonType[] = [
    { name: "기본", theme: "default" },
    { name: "오렌지", theme: "orange" },
    { name: "블루", theme: "blue" }
  ]
  useEffect(() => {

    const fetchData = async () => {

      try {
        const res = await fetch(`https://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.REACT_APP_API_KEY}`);
        const data = await res.json();
        console.log(data)
        setAllCarriers(data.Company)
        setCarriers(data.Company)
        // 완료되었을때 로딩끝
        setIsLoading(false);

      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [])

  const selectCode = (BtnNumber: number, code: string, name: string) => {
    // 국내가 false라 2번을 넘김
    setIsBtn(BtnNumber);
    setTcode(code);
    setTname(name);
    const isInternational = BtnNumber === 2 ? 'true' : 'false';
    const filterCarriers = allCarriers.filter(e => e.International === isInternational);
    setCarriers(filterCarriers)

  }
  // input의 경우 string을 (e : string) 이렇게 받을 수 없고 아래 처럼 설정해주어야한다.
  const blindNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자 0~9까지숫자만 입력할 수 있게 설정.
    const value = e.target.value;
    console.log(tcode)
    const result = carriers.find((e)=> e.Code === tcode)
//국내 배송일때만 숫자만 쓰기 가능하게 하기 위해서 result.International === "false"
    if (result) {
      if(result.International === "false"){
        e.target.value = e.target.value.replace(/[^0-9]/g, '')
      }
    }
    setTinvoice(value)
  }


  const PostSumbit = async () => {
    setIsLoading(true);
    // 새로 조회하기를 눌렀을때 아래에 배송상태를 없애주어야함
    setIsShow(false)
    // 성공했을때는 에러를 초기화 시켜서 안보여야함
    setError('')
    try {

      const res = await fetch(`https://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`);
      const data = await res.json();
      // 만약 택배가 접수 됐다면 무조건 firstDetail에 값이 있을텐데 없다면 null일거고 에러메세지 띄우고 로딩 께속 돌거니까 false값 을 줌
      if(data.firstDetail === null){
        setError("데이터 없음");
        setIsLoading(false);
        return ;
      }
      // 105 하루에 데이터 너무 많이 조회하면 뜨는 에러 
      if (data.code === '104' || data.code === '105') {
        setError(data.msg);
      } else {
        setInfoTracking(data);
        // 조회하기 눌렀을때 디테일 정보가 미리나오면 안되고 조회하기를 눌렀을때만 정보가 나와야해서 setIsShow(true)를 해준다.
        setIsShow(true)
      }
      setIsLoading(false);
      console.log(data)
    } catch (error) {
      console.log(error);
    }


    // http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=08&t_invoice=406332550175&t_key=nSY8t0ppGgkyTzE1cer4Vg
    // http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}
    //http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}
    // const url = new URL(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`)
    // const url = new URL("http://info.sweettracker.co.kr/api/v1/trackingInfo");
    // url.searchParams.append("t_code", tcode)
    // url.searchParams.append("t_invoice", tinvoice)
    // url.searchParams.append("t_key",` ${process.env.REACT_APP_API_KEY}`)
    // console.log(url)

  }
  const PostListName: string[] = ["상품인수", "상품이동중", "배송지도착", "배송출발", "배송완료"];

  return (
    <>
      {
        isLoading &&
        <div className="fixed w-full h-full bg-black/50 top-0 left-0 z-50">
          <div className="absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 ">
            <svg width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
              <g transform="rotate(0 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
                </rect>
              </g><g transform="rotate(30 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
                </rect>
              </g><g transform="rotate(60 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
                </rect>
              </g><g transform="rotate(90 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
                </rect>
              </g><g transform="rotate(120 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
                </rect>
              </g><g transform="rotate(150 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
                </rect>
              </g><g transform="rotate(180 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
                </rect>
              </g><g transform="rotate(210 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
                </rect>
              </g><g transform="rotate(240 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
                </rect>
              </g><g transform="rotate(270 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
                </rect>
              </g><g transform="rotate(300 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
                </rect>
              </g><g transform="rotate(330 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
                </rect>
              </g>
            </svg>

          </div>

        </div>
      }
      <div className={`p-5 text-black text-sm md:text-xl xl:text-2xl flex justify-between ${themeColor[theme].back}`}>
        <h3 className="font-extrabold">국 내.외 택배조회 시스템</h3>
        <div className="">
          <span>테마: </span>
          {
            buttons.map((e, i) => {
              return (
                <button key={i} className="mx-1 md:mx-2 xl:mx-3" onClick={() => setTheme(e.theme)}>{e.name}</button>
              )
            })
          }
        </div>
      </div>
      <div className="w-4/5 md:w-3/5 xl:w-4/12 mx-auto my-40 flex rounded items-center pt-2 flex-wrap">
        <div className="border-b basis-full py-2 px-2 flex justify-center items-center text-sm">
          <span className="basis-[30%] text-center mr-5">국내/국외 선택</span>
          <button className={`text-sm border p-1 px-5 rounded hover:text-white mr-4
          ${isBtn === 1 ? 'text-white' : 'text-black '} ${themeColor[theme].hover}
          ${isBtn === 1 ? themeColor[theme].active : ''}`} onClick={() => selectCode(1, '04', '대한통운')}>국내</button>
          <button className={`text-sm border p-1 px-5 rounded hover:text-white  ${isBtn === 2 ? 'text-white' : 'text-black '} ${themeColor[theme].hover}
          ${isBtn === 2 ? themeColor[theme].active : ''}`} onClick={() => selectCode(2, '12', 'EMS')}>국외</button>
        </div>
        {/* {tcode} {tname} {tinvoice} */}
        <div className="basis-full py-4 border-b">
          <select className="w-full  border rounded-md p-2 " value={tcode}
            onChange={(e) => {
              const result_code = e.target.value;
              setTcode(e.target.value);
              const result = carriers.find((e) => e.Code === result_code);
              if (result) {
                setTname(result.Name);
              }
            }}>
            {
              carriers.map((e, i) => {
                return (
                  <option key={i} value={e.Code}>{e.Name}</option>
                )
              })
            }
          </select>
        </div>
        <div className="basis-full py-4 border-b text-center">
          <input type="text" onInput={blindNumber} placeholder="운송장 번호를 입력해주세요." className={`w-full border px-5 py-2 rounded-md ${themeColor[theme].outline}`} />
        </div>
        <div className="basis-full border-b py-4 text-center">
          <button onClick={PostSumbit} className={`${themeColor[theme].back} text-white px-5 py-2 rounded-md w-full`}>조회하기</button>
        </div>
        {
          //에러가 있을때만 출력 
          error &&
          <div className="basis-full text-center py-4 border-b">
            <span className={`${themeColor[theme].text} font-bold`}>{error}</span>
          </div>
        }

      </div>
      {/* <img src="ic_sky_delivery_step1_off.png" alt="" /> */}
      {
        isShow &&
        <>
          <div className="w-full">
            <div className={`${themeColor[theme].back} text-white flex justify-center py-10 px-5 flex-wrap items-center text-center`}>
              <span className="text-xl basis-[45%] font-bold mr-5 mb-5">운송장 번호</span>
              <h3 className="text-xl basis-[45%] font-bold mb-5">{tinvoice}</h3>
              <span className="text-xl basis-[45%] font-bold mr-5 mb-5">택배사</span>
              <h3 className="text-xl basis-[45%] font-bold mb-5">{tname}</h3>
            </div>
          </div>
          <div className="bg-white my-5 flex justify-around py-5 relative before:bg-[#e2e5e8] before:absolute before:h-[1px] before:box-border before:top-[45%] before:left-[10%] before:w-4/5 before:z-0">
            {
              Array(5).fill('').map((_, i) => {
                // ininfoTracking의 level = 현재 상태
                const resultlevel = infoTracking && i + 1 === (infoTracking?.level - 1)
                return (
                  <div key={i} className={`${resultlevel ? themeColor[theme].after : 'after:bg-gray-200'} relative z-10 after:absolute after:w-[60px] after:h-[60px]
                after:rounded-full after:left-0 after:top-0`}>
                    <img className="relative z-10" src={`/images/ic_sky_delivery_step${i + 1}_on.png`} alt={PostListName[i]} />
                    <p className={`${resultlevel ? `${themeColor[theme].text} font-bold` : ''} text-center text-xs mt-1`}>{PostListName[i]}</p>
                  </div>
                )
              })
            }
          </div>
          <div className="bg-white py-5">
            {
              // 눌렀을때 데이터가 오기 때문에 없으면 에러나서 infoTracking 써줌
              infoTracking && infoTracking.trackingDetails.slice().reverse().map((e, i) => {
                return (
                  <div className={`pl-20 py-5 relative group ${themeColor[theme].odd}`} key={i}>
           {/* 배송상태에 따라 디테일 나올때 맨 위에 동그라미가 들어와 줘야해서 i === 0 */}
                    <div className={`${(i===0) ? `${themeColor[theme].back} ${themeColor[theme].border}` : 'bg-white'} relative border-2 rounded-full w-2 h-2 -left-[30px] top-10 z-30`}></div>
                    <p>{e.where} | {e.kind}</p>
                    <p>{e.telno}</p>
                    <p>{e.timeString}</p>
                    <div className={`group-last:h-0 h-full absolute w-0.5 left-[53px] top-[60px] z-20 ${themeColor[theme].back}`}></div>
                  </div>
                )
              })

            }
          </div>
        </>
      }
    </>
  );
}

export default App;
