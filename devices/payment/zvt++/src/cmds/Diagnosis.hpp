/*
 * EndOfDay.hpp
 *
 *  Created on: 24.11.2020
 *      Author: ah
 */

#ifndef CMDS_DIAGNOSIS_HPP_
#define CMDS_DIAGNOSIS_HPP_

#include <Apdu.hpp>

#include <iostream>
#include <bitset>

namespace Cmd
{

class Diagnosis: public Zvt::Apdu
{
private:
	Zvt::DiagnosisType _type;

public:
	Diagnosis();
	Diagnosis(Zvt::DiagnosisType);
	virtual ~Diagnosis();
	Diagnosis(const Diagnosis& other);

	inline Zvt::DiagnosisType type() const
	{
		return this->_type;
	}
};
}
#endif /* CMDS_DIAGNOSIS_HPP_ */
