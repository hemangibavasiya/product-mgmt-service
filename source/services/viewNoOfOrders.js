const dbCon = require('../constants/dbCon')
const { getDataWithAggregate, updateData } = require('../repository/commonRepo')

const viewNoOfOrders = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = await generateQuery()
            const finalData = await getDataWithAggregate(query, dbCon.COLLECTION_USER)
            const updatedData = await updateDataOfUsers(finalData)

            return resolve(updatedData)
        } 
        catch (error) {
            return reject(error)
        }
    })
}


async function updateDataOfUsers(finalData) {
    const UpdatedData = []
    for (const user of finalData) {
        const res = await updateData({'userId': user.userId}, user, dbCon.COLLECTION_USER)
        UpdatedData.push(res)
    }
    let response = {}
    if (UpdatedData.length !== 0) {
        response = 
            {success: true, message : "Successfully updated"}
    }
    return response
}

function generateQuery() {
    const query = []
    const project = {
        'userId': true,
        'name': true,
        '_id': false
    }
    const projection = generateProjection(project)
    query.push(projection)
    const join = {
        '$lookup': {
          'from': 'order', 
          'let': {
            'id': '$userId'
          }, 
          'pipeline': [
            {
              '$match': {
                '$expr': {
                  '$eq': [
                    '$userId', '$$id'
                  ]
                }
              }
            }
          ], 
          'as': 'orderData'
        }
      }
    query.push(join)
    const unwind =  {
        '$unwind': {
          'path': '$orderData'
        }
      }
    query.push(unwind)
    const group = {
        '$group': {
          '_id': {
            'userId': '$userId', 
            'name': '$name'
          }, 
          'totalData': {
            '$sum': 1
          }
        }
      }
    query.push(group)
    const finalpro = {
        'userId': '$_id.userId', 
        'name': '$_id.name', 
        'Number_of_orders': '$totalData', 
        '_id': false
      }
    const finalProjection = generateProjection(finalpro)
    query.push(finalProjection)

    const sort = {
        '$sort': {
          'User Id': 1
        }
      }
    query.push(sort)

      return query
}

function generateProjection(project) {
    const tempProjection = {}
    tempProjection['$project'] = project
    return tempProjection
}
module.exports = {
    viewNoOfOrders
}