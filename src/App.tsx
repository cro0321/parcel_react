import { useEffect, useState } from "react";
import { Interface } from "readline";

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
  const [infoTracking, setInfoTracking] = useState<string>();

  const themeColor: ThemeColor = {
    "default": {
      "back": "bg-indigo-500",
      "hover": "hover:bg-indigo-300",
      "active": "bg-indigo-400",
      "text": "text-indigo-500",
      "outline" : "outline-indigo-300"
    },
    "orange": {
      "back": "bg-orange-500",
      "hover": "hover:bg-orange-300",
      "active": "bg-orange-400",
      "text": "text-orange-500",
      "outline" : "outline-orange-300"
    },
    "blue": {
      "back": "bg-blue-500",
      "hover": "hover:bg-blue-300",
      "active": "bg-blue-400",
      "text": "text-blue-500",
      "outline" : "outline-blue-300"
    }
  }

  const buttons: ButtonType[] = [
    { name: "기본", theme: "default" },
    { name: "오렌지", theme: "orange" },
    { name: "블루", theme: "blue" }
  ]
  useEffect(()=>{
    
    const fetchData = async ()=>{
      try{
        const res = await fetch(`http://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.REACT_APP_API_KEY}`);
        const data = await res.json();
        setAllCarriers(data.Company)
        setCarriers(data.Company)
        }catch(error){
          console.log(error);
        }
      }
      fetchData();
  },[])

  const selectCode = (BtnNumber: number, code: string, name:string) =>{
    // 국내가 false라 2번을 넘김
    setIsBtn(BtnNumber);
    setTcode(code);
    setTname(name);
    const isInternational = BtnNumber === 2 ? 'true' : 'false';
    const filterCarriers = allCarriers.filter(e=>e.International === isInternational);
    setCarriers(filterCarriers)

  }
  // input의 경우 string을 (e : string) 이렇게 받을 수 없고 아래 처럼 설정해주어야한다.
  const blindNumber = (e : React.ChangeEvent<HTMLInputElement>) =>{
    // 숫자 0~9까지숫자만 입력할 수 있게 설정.
    const value = e.target.value
    e.target.value = e.target.value.replace(/[^0-9]/g,'')
    setTinvoice(value)
  }


  const PostSumbit = async ()=>{
  
    try{
      const res = await fetch(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`);
      const data =  res.json();
      console.log(data)
    }catch(error){
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

  return (
    <>

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
          ${isBtn === 1 ? themeColor[theme].active : ''}`}  onClick={()=> selectCode(1,'04', '대한통운')}>국내</button>
        <button className={`text-sm border p-1 px-5 rounded hover:text-white  ${isBtn === 2 ? 'text-white' : 'text-black '} ${themeColor[theme].hover}
          ${isBtn === 2 ? themeColor[theme].active : ''}`} onClick={()=> selectCode(2,'12', 'EMS')}>국외</button>
      </div>
      {/* {tcode} {tname} {tinvoice} */}
      <div className="basis-full py-4 border-b">
      <select className="w-full  border rounded-md p-2 " value={tcode} onChange={(e)=>{setTcode(e.target.value)}}>
        {
            carriers.map((e, i) => {
              return (
                <option  key={i} value={e.Code}>{e.Name}</option>
              )
            })
          }
      </select>
      </div>
      <div className="basis-full py-4 border-b text-center">
        <input type="text"  onInput={blindNumber} placeholder="운송장 번호를 입력해주세요." className={`w-full border px-5 py-2 rounded-md ${themeColor[theme].outline}`}/>
      </div>
      <div className="basis-full border-b py-4 text-center">
        <button onClick={PostSumbit} className={`${themeColor[theme].back} text-white px-5 py-2 rounded-md w-full`}>조회하기</button>
      </div>
      </div>
    </>
  );
}

export default App;
