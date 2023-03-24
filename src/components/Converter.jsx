import { useState, useEffect } from 'react';
import './Converter.css'

const Converter = () => {
    const [dynamicFxRate, setDynamicFxRate] = useState(1.1);
    const [userTypedFxRate,setUserTypedFxRate]=useState(0);
    const [inputValueFromUser, setInputValueFromUser] = useState(0);
    const [overRideSwitch, setOverRideSwitch] = useState('NO');
    const [currencySwitch, setCurrencySwitch] = useState('EUR');
    const [fetchHistoricalData, setFetchHistoricalData] = useState([]);
    

    useEffect(() => {
        let max_num = 0.05;
        let min_num = -0.05;
        let default_num = 1.1;
        const calculateIntervalId = setInterval(() => {
            setDynamicFxRate(Number((default_num + (Math.random() * (max_num - min_num) + min_num )).toFixed(2)));
        }, 3000);
        return () => clearInterval(calculateIntervalId);
    }, [dynamicFxRate]);

    const handleOverrideChangeSwitch = (e) => {
        if(e.target.value === "YES"){
            setOverRideSwitch("NO");
        }else{
            setOverRideSwitch("YES");
        }
    };

    const handleFinalHistoricalDataPreparation = (
            finalRate,
            overrideFlag,
            inputValueFromUser,
            currencySwitch,
            finalConvertedValue
        ) => {
        setFetchHistoricalData([
            {
                finalRate,
                overrideFlag,
                inputValueFromUser,
                currencySwitch,
                finalConvertedValue,
            },
            ...fetchHistoricalData
        ]);
    }

    const handleCurrencyChangeSwitch = (e) => {
        if(e.target.value === "EUR"){
            setCurrencySwitch("USD");
        }else{
            setCurrencySwitch("EUR");
        }
    };
    
    const handleConversionOperation = () => {

        if(inputValueFromUser === 0){
            alert("Enter amount greater than zero");
            return;
        }

        if(overRideSwitch === 'YES' && userTypedFxRate === 0){
            alert("Enter valid override rate");
            return;
        }

        let finalConvertedValue = 0;

        let checkOverRideStatus = false;
        
        if(overRideSwitch === 'YES'){
            checkOverRideStatus  = true;
        } else{
            checkOverRideStatus = false;
        } 

        let calculateDifferenceBetweenFXRates = Math.abs(userTypedFxRate -  dynamicFxRate) / dynamicFxRate;

        if(checkOverRideStatus && (calculateDifferenceBetweenFXRates > 0.02)){
            if(checkOverRideStatus === true){
                checkOverRideStatus = false;
            }
        }

        if (currencySwitch === 'USD') {
            if(checkOverRideStatus === true){
                finalConvertedValue = inputValueFromUser / userTypedFxRate;
            }else{
                finalConvertedValue = inputValueFromUser / dynamicFxRate;
            }
        } else{
            if(checkOverRideStatus === true){
                finalConvertedValue = inputValueFromUser * userTypedFxRate;
            }else{
                finalConvertedValue = inputValueFromUser * dynamicFxRate;
            }
        }

        finalConvertedValue = Number(finalConvertedValue.toFixed(2));

        if (fetchHistoricalData.length >= 5) {
            fetchHistoricalData.pop();
        }

        let finalRate = false;

        if(checkOverRideStatus){
            finalRate = userTypedFxRate;
        }else{
            finalRate = dynamicFxRate;
        }

        let overrideFlag = 'NO';

        if(checkOverRideStatus){
            overrideFlag = 'YES';
        }else{
            overrideFlag = 'NO';
        }

        handleFinalHistoricalDataPreparation( 
            finalRate,
            overrideFlag,
            inputValueFromUser,
            currencySwitch,
            finalConvertedValue
        );

    };

    const checkValidityOfInputAmount=(event) => {
        let period_check = event.which===46;
        let num_start_point = event.which >= 48;
        let num_end_point = event.which <= 57;
        if(!((num_start_point && num_end_point) || period_check)){
            event.preventDefault();
         }
      }

    return (
        <div className='container mt-2'>
            <div className='d-flex justify-content-center'>
                <div className='' >
                    <div className='display-5 bg-warning p-4 mb-5 mt-3'>
                        <div className='text-danger'>USD / EUR Converter</div>
                    </div>
                    <div className='form-group my-3'>
                        <div className='row'>
                            <div className='col-6'>
                                <label htmlFor='fx-rate'>FX Convertion Rate:</label>
                            </div>
                            <div className='col-6'>
                                <input
                                    type='text'
                                    id='fx-rate'
                                    className='form-control'
                                    value={dynamicFxRate}
                                    disabled
                                    onKeyPress={checkValidityOfInputAmount}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='form-group my-3'>
                        <div className='row'>
                            <div className='col-6'>
                                <label htmlFor='input-value'>Enter Conversion Amount:</label>
                            </div>
                            <div className='col-6'>
                                <input
                                    type='text'
                                    id='input-value'
                                    className='form-control'
                                    value={inputValueFromUser}
                                    onChange={e => setInputValueFromUser(e.target.value)}
                                    onKeyPress={checkValidityOfInputAmount}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='form-group my-3'>
                        <div className='row'>
                            <div className='col-6'>
                                Convert Amount Into:
                            </div>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-4 fw-bold'>
                                        <label className="form-check-label" style={currencySwitch==="EUR"? {color:'red'}: {color:'black'}} >EUR</label>
                                    </div>
                                    <div className="form-check form-switch form-switch-md col-4">
                                        <input className="form-check-input" type="checkbox" id="currency"  name='currency' value={currencySwitch} checked={ currencySwitch === 'USD' ? true : false } onChange={handleCurrencyChangeSwitch} />
                                    </div>
                                    <div className='col-4 fw-bold'>
                                        <label class="form-check-label" style={currencySwitch==="USD"? {color:'red'}: {color:'black'}}>USD</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='form-group my-3'>
                        <div className='row'>
                            <div className='col-6'>
                                Override FX Rate:
                            </div>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-4 fw-bold'>
                                        <label class="form-check-label" style={overRideSwitch==="NO"? {color:'red'}: {color:'black'}}>NO</label>
                                    </div>
                                    <div class="form-check form-switch form-switch-md col-4">
                                        <input class="form-check-input" type="checkbox" id="override"  name='override' value={overRideSwitch} checked={ overRideSwitch === 'YES' ? true : false } onChange={handleOverrideChangeSwitch} />
                                    </div>
                                    <div className='col-4 fw-bold'>
                                        <label class="form-check-label" style={overRideSwitch==="YES"? {color:'red'}: {color:'black'}}>YES</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {overRideSwitch === 'YES' &&
                     <div className='form-group my-3'>
                     <div className='row'>
                         <div className='col-6'>
                             <label htmlFor='override'>Enter Overridden FX Value:</label>
                         </div>
                         <div className='col-6'>
                             <input
                             type='text'
                             className='form-control'
                             value={userTypedFxRate}
                             onChange={e => setUserTypedFxRate(e.target.value)}
                             onKeyPress={checkValidityOfInputAmount}
                             />
                        </div>
                        </div>
                        </div>
                    }
                    <div className='form-group my-3'>
                        <div className='text-center'>
                            <button onClick={handleConversionOperation} className='btn btn-primary w-50'>Convert</button>
                        </div>
                    </div>
                    {
                        fetchHistoricalData.length > 0 &&
                        <div className='mb-5 '>
                            <hr />
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Given Amount</th>
                                        <th>FX Rate</th>
                                        <th>Converted Amount</th>
                                        <th>Whether Overridden</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fetchHistoricalData.map((data, index) => (
                                        <tr key={index}>
                                            <td>{data.inputValueFromUser + " "}{data.currencySwitch === 'EUR' ? 'USD' : 'EUR'}</td>
                                            <td>{data.finalRate}</td>
                                            <td>{data.finalConvertedValue + " " + data.currencySwitch}</td>
                                            <td>{data.overrideFlag}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
export default Converter;