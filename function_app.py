import datetime
import requests
import azure.functions as func
import azure.durable_functions as df

def get_date_time():
    # Replace 'YOUR_API_ENDPOINT' with the actual API endpoint you want to call
    api_endpoint = 'https://aptify.awcnet.org/Aptifyservicesapi/services/checkconnection'
    
    try:
        response = requests.get(api_endpoint)
        if response.status_code == 200:
            # Assuming the API returns date and time in a specific format
            date_time = response.json().get('datetime')
            return date_timec
        else:
            return None
    except Exception as e:
        print("Error:", e)
        return None

def orchestrator_function(context: df.DurableOrchestrationContext):
    while True:
        current_time = context.current_utc_datetime
        date_time = get_date_time()
        if date_time:
            yield context.call_activity('ReturnDateTime', date_time)
        yield context.create_timer(current_time + datetime.timedelta(minutes=1))

main = df.Orchestrator.create(orchestrator_function)


@app.route(route="http_trigger", auth_level=func.AuthLevel.ANONYMOUS)
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )

@app.route(route="http_trigger", auth_level=func.AuthLevel.ANONYMOUS)
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )